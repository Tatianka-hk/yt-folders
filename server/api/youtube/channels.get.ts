import { defineEventHandler, getQuery, createError } from 'h3'
import type { YoutubeChannelOption } from '~/types'

export default defineEventHandler(async (event) => {
    const { q, maxResults } = getQuery(event)

    const query = String(q ?? '').trim()
    const max = Math.min(Number(maxResults ?? 10), 25)

    if (!query) return []

    const key = process.env.YOUTUBE_API_KEY
    if (!key) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Missing YOUTUBE_API_KEY',
        })
    }

    // 1) Search channels by query
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    searchUrl.searchParams.set('part', 'snippet')
    searchUrl.searchParams.set('type', 'channel')
    searchUrl.searchParams.set('q', query)
    searchUrl.searchParams.set('maxResults', String(max))
    searchUrl.searchParams.set('key', key)

    const searchRes = await $fetch<any>(searchUrl.toString())
    const items = Array.isArray(searchRes?.items) ? searchRes.items : []

    const channelIds: string[] = items
        .map((it: any) =>
            it?.snippet && it?.id?.channelId ? String(it.id.channelId) : null
        )
        .filter(Boolean)

    if (!channelIds.length) return []

    // 2) Get channels details (snippet + statistics)
    const channelsUrl = new URL(
        'https://www.googleapis.com/youtube/v3/channels'
    )
    channelsUrl.searchParams.set('part', 'snippet,statistics')
    channelsUrl.searchParams.set('id', channelIds.join(','))
    channelsUrl.searchParams.set('key', key)

    const channelsRes = await $fetch<any>(channelsUrl.toString())
    const chItems = Array.isArray(channelsRes?.items) ? channelsRes.items : []

    // Map by id
    const byId = new Map<string, any>()
    for (const ch of chItems) byId.set(String(ch.id), ch)

    const result: YoutubeChannelOption[] = channelIds.map((id) => {
        const ch = byId.get(id)
        const snippet = ch?.snippet
        const stats = ch?.statistics

        const thumbs = snippet?.thumbnails
        const thumb =
            thumbs?.default?.url || thumbs?.medium?.url || thumbs?.high?.url

        return {
            id,
            title: snippet?.title ?? id,
            handle: snippet?.customUrl
                ? `@${String(snippet.customUrl).replace(/^@/, '')}`
                : undefined,
            thumbnail: thumb,
            subscribers: stats?.subscriberCount
                ? Number(stats.subscriberCount)
                : undefined,
        }
    })

    return result
})
