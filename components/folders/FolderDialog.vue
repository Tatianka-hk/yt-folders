<template>
    <Dialog
        :onClose="closeDialog"
        :isOpen="isOpen"
        classString="min-w-[200px] !px-[20px]"
    >
        <div class="flex flex-col w-full gap-4">
            <Field v-model="folderName" :label="t('folder.name')" type="text" />

            <YotubeChannelsMultiselect
                @update:query="onSearch"
                v-model="selectedChannels"
                :options="results"
                :isLoading="loading"
            />

            <VButton @click="save" class="mt-4 !bg-secondary">
                {{
                    mode === FolderDialogEnum.CREATE
                        ? t('folder.create')
                        : t('folder.edit')
                }}
            </VButton>
        </div>
    </Dialog>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Dialog, Field, YotubeChannelsMultiselect } from '~/ui'
import { useSnackbar } from '~/composables/useSnackbar'
import type { IAction, IChannel, IYoutubeChannelOption } from '~/types'
import { FolderDialogEnum } from '~/types'
import { getYoutubeChannels } from '~/apis/youtube'
import { createFolder, getFolder, updateFolder } from '~/apis/folders'
import { useYoutubeChannelSearch } from '~/composables/useYoutubeChannelSearch'
import { useI18n } from '#imports'
const props = withDefaults(
    defineProps<{
        isOpen: boolean
        closeDialog: () => void
        folderId?: string
        mode?: FolderDialogEnum
    }>(),
    {
        mode: FolderDialogEnum.CREATE,
    }
)

const { t } = useI18n()
const { showSnackbar } = useSnackbar()
const folderName = ref<string>('')
const selectedChannels = ref<IChannel[]>([])
const youtubeChannels = ref<IYoutubeChannelOption[]>([])
const isLoading = ref<boolean>(false)
const emit = defineEmits<{
    (e: 'changed'): void
    (e: 'searched'): void
}>()

const { query, results, loading, error } = useYoutubeChannelSearch({
    debounceMs: 800,
    maxResults: 12,
    minQueryLength: 4,
    cacheTtlMs: 5 * 60_000,
})

const save = async () => {
    if (folderName.value?.length < 3) {
        showSnackbar(t('folder.nameError'), 'error')
        return
    }
    let res: IAction
    if (props.mode === FolderDialogEnum.CREATE) {
        res = await createFolder(folderName.value, selectedChannels.value)
    } else {
        res = await updateFolder(
            props.folderId as string,
            folderName.value,
            selectedChannels.value
        )
    }
    if (res.success) {
        emit('changed')
        showSnackbar(t('folder.createSuccess'), 'success')
    } else {
        showSnackbar(t('auth.errors.something_went_wrong'), 'error')
    }

    props.closeDialog()
}

const onSearch = (e: string) => {
    query.value = e
    emit('searched')
}
onMounted(async () => {
    isLoading.value = true
    try {
        const channels = await getYoutubeChannels()
        youtubeChannels.value = channels
        if (props.mode === FolderDialogEnum.UPDATE) {
            const res = await getFolder(props.folderId as string)
            folderName.value = res.folder?.name
            selectedChannels.value = res.folder?.youtubeChannelsIDs
        }
    } finally {
        isLoading.value = false
    }
})
</script>
