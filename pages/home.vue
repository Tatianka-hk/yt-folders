<template>
    <div class="w-full h-full flex flex-col gap-[40px]">
        <div class="w-full flex justify-end gap-2">
            <LanguageInput />
            <LogoutButton />
        </div>
        <div class="w-full flex items-center justify-center">
            <Logo />
        </div>
        <div class="w-full w-screen flex items-center justify-end"></div>
        <Loading v-if="isAuthLoading" />
        <div
            v-else
            class="w-full h-full flex gap-[40px] relative lg:flex-row flex-col"
        >
            <FoldersList
                @selected="selectedFolderId = $event"
                @searched="getSearchAmount"
                @changed="getUserFolders"
                :folders="folders"
                :selectedFolderId="selectedFolderId as string"
            />
            <div class="w-full" v-if="selectedFolderId">
                <HeaderVideoGrid
                    :title="selectedFolderTitle"
                    :folderId="selectedFolderId"
                    @changed="getUserFolders"
                    @searched="getSearchAmount"
                    @deleted="refreshFoldersAndSelectFirst"
                />
                <VideoGrid :channelIds="selectedChannelsIds" />
            </div>
            <div v-else></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { IFolder } from '~/types'
import { useCustomRoute } from '~/composables/useCustomRoute'
import { useAuth } from '~/composables/useAuth'
import { getUserAmountSearch } from '~/apis/user'
import { CONTEXT_SEARCH_AMOUNT_KEY } from '~/static'
import { LogoutButton } from '../components/auth'
import { getFolders } from '~/apis/folders'
import {
    FoldersList,
    VideoGrid,
    LanguageInput,
    HeaderVideoGrid,
} from '../components'
import { Logo, Loading } from '../ui'

const { isAuthLoading, isAuth } = useAuth()
const { goToRoute } = useCustomRoute()
const folders = ref<IFolder[]>([])
const searchAmount = ref<number>(0)
const selectedFolderId = useState<string | null>(
    'home-selected-folder',
    () => null
)

const selectedChannelsIds = computed(() => {
    const folder = folders.value.find((f) => f._id === selectedFolderId.value)
    return folder?.youtubeChannelsIDs || []
})

const selectedFolderTitle = computed(() => {
    const folder = folders.value.find((f) => f._id === selectedFolderId.value)
    return folder?.name || ''
})

const getSearchAmount = async () => {
    try {
        const res = await getUserAmountSearch()
        searchAmount.value = res.amount
    } catch (err) {
        console.error('Помилка запиту:', err)
    }
}
const getUserFolders = async () => {
    try {
        const res = await getFolders()
        folders.value = res.folders
    } catch (err) {
        console.error('Помилка запиту:', err)
    }
}

const refreshFoldersAndSelectFirst = async () => {
    await getUserFolders()
    selectedFolderId.value = folders.value?.[0]?._id ?? null
}

provide(CONTEXT_SEARCH_AMOUNT_KEY, {
    searchAmount,
})

onMounted(async () => {
    await getSearchAmount()
    await refreshFoldersAndSelectFirst()
})

watch(
    [isAuthLoading, isAuth],
    ([loading, authenticated]) => {
        if (!loading && !authenticated) {
            goToRoute('login')
        }
    },
    { immediate: true }
)
</script>
