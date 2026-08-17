import { defineEventHandler, getQuery, createError } from 'h3'
import { searchQuotaRepository } from '~/server/reposentories/searchQuota.repository'
import { trackUserEvent } from '~/server/services/analyticsService'
import { EVENTS } from '~/static/analytic'
import connectDB from '~/server/utils/db'
import type { IYoutubeChannelOption } from '~/types'

const DEFAULT_MAX_RESULTS = 10
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

interface YouTubeSearchResponse {
    items?: Array<{
        id?: { channelId?: string }
        snippet?: unknown
    }>
}

interface YouTubeChannelsResponse {
    items?: Array<{
        id: string
        snippet?: {
            title?: string
            customUrl?: string
            thumbnails?: {
                default?: { url?: string }
                medium?: { url?: string }
                high?: { url?: string }
            }
        }
        statistics?: {
            subscriberCount?: string
        }
    }>
}

export default defineEventHandler(async (event) => {
    const { q, maxResults } = getQuery(event)
    const searchQuery = String(q ?? '').trim()

    if (!searchQuery) return []
    try {
        await connectDB()
        const userId = event.context.userId
        if (!userId) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
            })
        }
        const quota = await searchQuotaRepository.reserveQuota(userId)

        if (!quota) {
            throw createError({
                statusCode: 429,
                statusMessage: 'Limit reached',
            })
        }

        try {
            const apiKey = getApiKey()
            const channelIds = await fetchChannelIds(
                searchQuery,
                Number(maxResults ?? DEFAULT_MAX_RESULTS),
                apiKey
            )

            await trackUserEvent({
                userId: userId,
                email: event.context.email,
                type: EVENTS.CHANNEL_SEARCH,
                data: {
                    query: searchQuery,
                    resultsCount: channelIds.length,
                },
            })
            if (!channelIds.length) return []

            return await fetchAndMapChannelDetails(channelIds, apiKey)
        } catch (err: any) {
            await searchQuotaRepository.releaseQuota(userId)
            throw err
        }
    } catch (err: any) {
        console.error('/youtube/channels.get:', err)
        throw createError({
            statusCode: err.statusCode ?? 500,
            statusMessage: err.message ?? 'Server error',
        })
    }
})

function getApiKey(): string {
    const key = process.env.YOUTUBE_API_KEY
    if (!key) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Missing YOUTUBE_API_KEY',
        })
    }
    return key
}

async function fetchChannelIds(
    query: string,
    maxResults: number,
    apiKey: string
): Promise<string[]> {
    const url = new URL(`${YOUTUBE_API_BASE}/search`)
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('type', 'channel')
    url.searchParams.set('q', query)
    url.searchParams.set('maxResults', String(maxResults))
    url.searchParams.set('key', apiKey)

    const response = await $fetch<YouTubeSearchResponse>(url.toString())
    const items = Array.isArray(response?.items) ? response.items : []

    return items
        .map((item) => item?.id?.channelId)
        .filter((id): id is string => Boolean(id))
}

async function fetchAndMapChannelDetails(
    channelIds: string[],
    apiKey: string
): Promise<IYoutubeChannelOption[]> {
    const url = new URL(`${YOUTUBE_API_BASE}/channels`)
    url.searchParams.set('part', 'snippet,statistics')
    url.searchParams.set('id', channelIds.join(','))
    url.searchParams.set('key', apiKey)

    const response = await $fetch<YouTubeChannelsResponse>(url.toString())
    const channels = Array.isArray(response?.items) ? response.items : []

    const channelsMap = new Map(channels.map((ch) => [ch.id, ch]))

    return channelIds.map((id) => {
        const channel = channelsMap.get(id)
        return mapToChannelOption(id, channel)
    })
}

function mapToChannelOption(
    id: string,
    // @ts-ignore
    channel: YouTubeChannelsResponse['items'][number] | undefined
): IYoutubeChannelOption {
    const snippet = channel?.snippet
    const stats = channel?.statistics

    return {
        id,
        title: snippet?.title ?? id,
        handle: formatHandle(snippet?.customUrl),
        thumbnail: extractThumbnail(snippet?.thumbnails),
        subscribers: parseSubscribers(stats?.subscriberCount),
    }
}

function formatHandle(customUrl?: string): string | undefined {
    if (!customUrl) return undefined
    const cleanHandle = customUrl.replace(/^@/, '')
    return `@${cleanHandle}`
}

function extractThumbnail(
    thumbnails?: NonNullable<
        // @ts-ignore
        YouTubeChannelsResponse['items'][number]['snippet']
    >['thumbnails']
): string | undefined {
    return (
        thumbnails?.default?.url ||
        thumbnails?.medium?.url ||
        thumbnails?.high?.url
    )
}

function parseSubscribers(subscriberCount?: string): number | undefined {
    return subscriberCount ? Number(subscriberCount) : undefined
}
