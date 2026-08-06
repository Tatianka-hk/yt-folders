<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-3">
        <VideoCard
            v-for="video in videos"
            :key="video.videoId"
            :video="video"
        />
    </div>
</template>

<script setup lang="ts">
import type { IChannel, IVideo } from '@/types'
import { getYoutubeVideos } from '~/apis/youtube'

const props = defineProps<{
    channelIds: IChannel[]
}>()

const videos = ref<IVideo[]>([])

watch(
    () => props.channelIds,
    async (channelIds) => {
        const data = await getYoutubeVideos(
            props.channelIds.map((channel) => channel.id)
        )
        videos.value = data
    },
    { immediate: true }
)
</script>
