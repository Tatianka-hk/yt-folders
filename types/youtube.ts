export interface IYoutubeChannelOption {
    id: string // channelId
    title: string // назва каналу
    handle?: string // @handle
    thumbnail?: string // url аватарки
    subscribers?: number
}

export type IVideo = {
    videoId: string
    title: string
    publishedAt: string
    thumbnail?: string
    channelId: string
    channelTitle: string
    channelThumbnail?: string
}
