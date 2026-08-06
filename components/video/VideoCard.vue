<script setup lang="ts">
import type { IVideo } from '@/types'

const props = defineProps<{
    video: IVideo
}>()

const formatDate = (iso: string) => {
    const date = new Date(iso)
    const diff = Date.now() - date.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 24) return `${hours} год тому`

    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} днів тому`

    const months = Math.floor(days / 30)
    return `${months} міс тому`
}

const onClick = () => {
    window.open(`https://www.youtube.com/watch?v=${props.video.videoId}`)
}
</script>

<template>
    <div class="w-full max-w-[420px] cursor-pointer group" @click="onClick">
        <!-- Thumbnail -->
        <div class="relative rounded-xl overflow-hidden bg-black">
            <img
                :src="video.thumbnail"
                class="w-full aspect-video object-cover group-hover:scale-[1.03] transition duration-300"
                alt=""
            />

            <!-- Duration fake badge -->
            <div
                class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded"
            >
                <!-- якщо нема duration в типі — можна прибрати -->
                46:41
            </div>
        </div>

        <!-- Info block -->
        <div class="flex gap-3 mt-3">
            <!-- Channel avatar -->
            <img
                :src="video.channelThumbnail"
                class="w-9 h-9 rounded-full object-cover"
                alt=""
            />

            <!-- Text -->
            <div class="flex-1 min-w-0">
                <h3
                    class="text-sm font-semibold leading-5 text-white line-clamp-2 group-hover:text-blue-400 transition"
                >
                    {{ video.title }}
                </h3>

                <p class="text-xs text-gray-400 mt-1">
                    {{ video.channelTitle }}
                </p>

                <p class="text-xs text-gray-500">
                    {{ formatDate(video.publishedAt) }}
                </p>
            </div>

            <!-- More button -->
            <div
                class="text-gray-400 opacity-0 group-hover:opacity-100 transition"
            >
                ⋮
            </div>
        </div>
    </div>
</template>
