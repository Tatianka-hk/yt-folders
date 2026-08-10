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
                @selected="selectedFolderID = $event"
                @searched="getSearchAmount"
                @changed="getUserFolders"
                :folders="folders"
                :selectedFolderID="selectedFolderID as string"
            />
            <div class="w-full" v-if="selectedFolderID">
                <HeaderVideoGrid
                    :title="
                        folders.find((f) => f._id === selectedFolderID)?.name ||
                        ''
                    "
                    :folderId="selectedFolderID"
                    @changed="getUserFolders"
                    @searched="getSearchAmount"
                    @deleted="updateFolders"
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
const selectedFolderID = useState<string | null>(
    'home-selected-folder',
    () => null
)

const selectedChannelsIds = computed(() => {
    const folder = folders.value.find((f) => f._id === selectedFolderID.value)
    return folder?.youtubeChannelsIDs || []
})

const getSearchAmount = async () => {
    getUserAmountSearch()
        .then((v) => (searchAmount.value = v.amount))
        .catch((err) => console.error('Помилка запиту:', err))
}
const getUserFolders = async () => {
    const res = await getFolders()
    folders.value = res.folders
}

const updateFolders = async () => {
    await getUserFolders()
    selectedFolderID.value = folders?.value?.[0]?._id ?? null
}

provide(CONTEXT_SEARCH_AMOUNT_KEY, {
    searchAmount,
})

onMounted(async () => {
    await getSearchAmount()
    await updateFolders()
})

watch(isAuthLoading, (v) => {
    if (!isAuth.value && !isAuthLoading.value) {
        goToRoute('login')
    }
})
</script>
