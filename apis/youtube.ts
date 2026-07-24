import type { IVideo, IYoutubeChannelOption } from '~/types'
import { apiRequest } from './api'

const PREFIX = '/youtube'
// const apiKey = process.env.YOUTUBE_API_KEY
const apiKey = 'AIzaSyA1O9scGTkoUUGIJoXdkwdl4IQty9YyEa8'

export function getYoutubeChannels(): Promise<IYoutubeChannelOption[]> {
    return apiRequest({
        method: 'GET',
        url: `${PREFIX}/channels`,
    })
}

export async function getYoutubeVideos(
    channelIds: string[],
    perChannel = 10
): Promise<IVideo[]> {
    console.log('apiKey', apiKey)
    if (!channelIds.length) return []

    const uniq = Array.from(new Set(channelIds)).filter(Boolean)

    // ---- 1) Отримати uploads playlist + інформацію про канал
    const chunks: string[][] = []
    for (let i = 0; i < uniq.length; i += 50) {
        chunks.push(uniq.slice(i, i + 50))
    }

    const channelMap = new Map<
        string,
        { uploads: string; title: string; thumbnail?: string }
    >()

    for (const chunk of chunks) {
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&id=${chunk.join(
                ','
            )}&key=${apiKey}`
        )

        const json: any = await res.json()

        for (const item of json.items ?? []) {
            channelMap.set(item.id, {
                uploads: item.contentDetails?.relatedPlaylists?.uploads,
                title: item.snippet?.title ?? '',
                thumbnail:
                    item.snippet?.thumbnails?.high?.url ||
                    item.snippet?.thumbnails?.medium?.url ||
                    item.snippet?.thumbnails?.default?.url,
            })
        }
    }

    // ---- 2) Отримати відео
    const allVideos = await Promise.all(
        uniq.map(async (channelId) => {
            const channelData = channelMap.get(channelId)
            if (!channelData?.uploads) return []

            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${channelData.uploads}&maxResults=${Math.min(
                    perChannel,
                    50
                )}&key=${apiKey}`
            )

            const json: any = await res.json()

            return (json.items ?? [])
                .map((v: any) => {
                    const sn = v?.snippet
                    const videoId = sn?.resourceId?.videoId
                    if (!videoId) return null

                    return {
                        videoId,
                        title: sn?.title ?? '',
                        publishedAt: sn?.publishedAt ?? '',
                        thumbnail:
                            sn?.thumbnails?.medium?.url ||
                            sn?.thumbnails?.default?.url,
                        channelId,
                        channelTitle: channelData.title,
                        channelThumbnail: channelData.thumbnail,
                    }
                })
                .filter(Boolean)
        })
    )

    // ---- 3) Плоский масив + сортування по даті (новіші зверху)
    return allVideos
        .flat()
        .sort(
            (a, b) =>
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime()
        )
}
