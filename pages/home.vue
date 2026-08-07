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
            <FoldersList
                @selected="selectedChannelsIds = $event"
                @searched="getSearchAmount"
            />
            <VideoGrid :channelIds="selectedChannelsIds" />
        </div>
    </div>
</template>
<script setup lang="ts">
import type { IChannel } from '~/types'
import { useCustomRoute } from '~/composables/useCustomRoute'
import { useAuth } from '~/composables/useAuth'
import { getUserAmountSearch } from '~/apis/user'
import { CONTEXT_SEARCH_AMOUNT_KEY } from '~/static'
import { Logo, Loading } from '../ui'
import { FoldersList, VideoGrid, LanguageInput } from '../components'
import { LogoutButton } from '../components/auth'

const { isAuthLoading, isAuth } = useAuth()
const { goToRoute } = useCustomRoute()

const searchAmount = ref<number>(0)
const selectedChannelsIds = useState<IChannel[]>(
    'home-selected-channels',
    () => []
)

const getSearchAmount = () => {
    getUserAmountSearch()
        .then((v) => (searchAmount.value = v.amount))
        .catch((err) => console.error('Помилка запиту:', err))
}

provide(CONTEXT_SEARCH_AMOUNT_KEY, {
    searchAmount,
})

onMounted(async () => {
    getSearchAmount()
})

watch(isAuthLoading, (v) => {
    if (!isAuth.value && !isAuthLoading.value) {
        goToRoute('login')
    }
})
</script>
