<template>
    <Dialog
        :onClose="closeDialog"
        :isOpen="isOpen"
        classString="min-w-[200px] !px-[20px]"
    >
        <div class="flex flex-col w-full gap-4">
            <Field v-model="folderName" label="Название папки" type="text" />

            <YotubeChannelsMultiselect
                @update:query="(e) => (query = e)"
                v-model="selectedChannels"
                :options="results"
            />

            <VButton @click="save" class="mt-4">
                {{ t('button.saveInFolder') }}
            </VButton>
        </div>
    </Dialog>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Dialog, Field, YotubeChannelsMultiselect } from '~/ui'
import { useSnackbar } from '~/composables/useSnackbar'
import type { IAction, IYoutubeChannelOption } from '~/types'
import { FolderDialogEnum } from '~/types'
import { getYoutubeChannels } from '~/apis/youtube'
import { createFolder, getFolder, updateFolder } from '~/apis/folders'
import { useYoutubeChannelSearch } from '~/composables/useYoutubeChannelSearch'
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
const selectedChannels = ref<string[]>([])
const youtubeChannels = ref<IYoutubeChannelOption[]>([])
const isLoading = ref<boolean>(false)
const emit = defineEmits<{
    (e: 'changed'): void
}>()

const { query, results, loading, error } = useYoutubeChannelSearch({
    debounceMs: 350,
    maxResults: 12,
    minQueryLength: 2,
    cacheTtlMs: 5 * 60_000,
})

const save = async () => {
    if (folderName.value?.length < 3) {
        showSnackbar(t('folder.selectFolderError'), 'error')
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
