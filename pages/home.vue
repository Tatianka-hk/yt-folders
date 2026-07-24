<template>
    <div class="w-full h-full flex items-center flex-col gap-[40px]">
        <div class="w-full flex items-center">
            <Logo />
        </div>
        <div
            class="w-full h-full flex gap-[40px] relative lg:flex-row flex-col"
        >
            <FoldersList @selected="selectedChannelsIds = $event" />
            <VideoGrid :channelIds="selectedChannelsIds" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { Logo } from '../ui'
import { FoldersList, VideoGrid } from '../components'

const selectedChannelsIds = ref<string[]>([])

const { t } = useI18n()
</script>
