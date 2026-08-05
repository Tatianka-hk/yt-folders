<template>
    <div class="w-full h-full flex items-center flex-col gap-[40px]">
        <div class="w-full flex items-center">
            <Logo />
            <div className="w-full flex items-center justify-end">
                <LogoutButton />
            </div>
        </div>
        <div className="w-full w-screen flex items-center justify-end"></div>
        <Loading v-if="isAuthLoading" />
        <div
            v-else
            class="w-full h-full flex gap-[40px] relative lg:flex-row flex-col"
        >
            <FoldersList @selected="selectedChannelsIds = $event" />
            <VideoGrid :channelIds="selectedChannelsIds" />
        </div>
    </div>
</template>
<script setup lang="ts">
import type { IChannel } from '~/types'
import { Logo, Loading } from '../ui'
import { FoldersList, VideoGrid } from '../components'
import { LogoutButton } from '../components/auth'

const { isAuthLoading, isAuth } = useAuth()
const { goToRoute } = useCustomRoute()

watch(isAuthLoading, (v) => {
    if (!isAuth.value) {
        goToRoute('login')
    }
})

const selectedChannelsIds = ref<IChannel[]>([])
</script>
