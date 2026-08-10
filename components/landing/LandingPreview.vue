<template>
    <div class="relative flex w-full max-w-[520px] items-center justify-center">
        <!-- background glow -->
        <div
            class="absolute h-[300px] w-[300px] rounded-full bg-primary/10 blur-[90px] sm:h-[420px] sm:w-[420px]"
        />

        <div
            class="relative w-[250px] rotate-[5deg] rounded-[42px] border border-border bg-[#08080c] p-3 shadow-2xl sm:w-[300px] lg:w-[340px]"
        >
            <div class="overflow-hidden rounded-[32px] bg-background">
                <!-- fake phone top -->
                <div
                    class="flex items-center justify-between px-5 pb-3 pt-4 text-xs"
                >
                    <span>9:41</span>

                    <div class="flex gap-1">
                        <span>●</span>
                        <span>◒</span>
                        <span>▰</span>
                    </div>
                </div>

                <div class="px-4 pb-6">
                    <div class="mb-4 flex items-center justify-between">
                        <h3 class="text-lg font-semibold">
                            {{ t('folder.folders') }}
                        </h3>

                        <div
                            class="rounded-md bg-secondary px-3 py-1.5 text-xs"
                        >
                            + {{ t('folder.create') }}
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <div
                            v-for="folder in folders"
                            :key="folder.name"
                            class="flex items-center justify-between rounded-lg px-3 py-2.5"
                            :class="
                                folder.active
                                    ? 'bg-surfaceActive'
                                    : 'bg-surface'
                            "
                        >
                            <div class="flex items-center gap-2">
                                <Icon
                                    name="lucide:folder"
                                    class="h-4 w-4 text-primary"
                                />

                                <span class="text-sm">
                                    {{ folder.name }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <p class="mb-3 mt-6 text-sm font-medium">
                        {{ t('landing.preview.favorites') }}
                    </p>

                    <div class="space-y-3">
                        <div
                            v-for="video in videos"
                            :key="video.title"
                            class="overflow-hidden rounded-lg bg-surface"
                        >
                            <div
                                class="aspect-video bg-gradient-to-br from-secondary to-surfaceActive"
                            />

                            <div class="p-2">
                                <p class="truncate text-xs font-medium">
                                    {{ video.title }}
                                </p>

                                <p class="mt-1 text-[10px] text-textMuted">
                                    {{ video.channel }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'

const { t } = useI18n()

const folders = [
    {
        name: 'Mis favoritos',
        active: true,
    },
    {
        name: 'Tutoriales',
    },
    {
        name: 'Podcasts',
    },
    {
        name: 'Música',
    },
]

const videos = [
    {
        title: 'Mis vídeos favoritos',
        channel: 'YouTube',
    },
]
//     {
//         title: 'Contenido guardado',
//         channel: 'YouTube',
//     },
// ]
</script>
