<template>
    <div class="w-full h-full flex flex-col gap-[40px]">
        <div class="w-full flex justify-end gap-2">
            <LanguageInput />
            <LogoutButton />
        </div>
        <div className="w-full flex items-center justify-center">
            <Logo />
        </div>
        <div class="w-full w-screen flex items-center justify-end"></div>
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
import { FoldersList, VideoGrid, LanguageInput } from '../components'
import { LogoutButton } from '../components/auth'
import { useCustomRoute } from '~/composables/useCustomRoute'
import { useAuth } from '~/composables/useAuth'

const { isAuthLoading, isAuth, fetchAuth } = useAuth()
const { goToRoute } = useCustomRoute()

// onMounted(async () => {
//     await fetchAuth()
// })

watch(isAuthLoading, (v) => {
    console.log('asdas')
    if (!isAuth.value && !isAuthLoading.value) {
        goToRoute('login')
    }
})

const selectedChannelsIds = ref<IChannel[]>([])
</script>
