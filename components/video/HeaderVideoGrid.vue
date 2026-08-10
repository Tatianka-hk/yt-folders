<template>
    <div class="w-full flex items-center justify-between mb-5">
        <span class="text-text text-2xl font-julius flex gap-2">
            <IconFolder class="w-[30px] h-[30px]" />
            {{ props.title }}
        </span>

        <div class="flex gap-2 items-center">
            <HomeButton
                :onClick="
                    () => {
                        onEdit()
                    }
                "
                :ariaLabel="t('actions.edit')"
            >
                <IconEdit class="w-[24px] h-[24px]" />
                <span class="hidden md:block">{{ t('actions.edit') }}</span>
            </HomeButton>
            <HomeButton
                :onClick="
                    () => {
                        onDelete()
                    }
                "
                :ariaLabel="t('actions.delete')"
            >
                <IconDelete class="w-[24px] h-[24px]" />
                <span class="hidden md:block">{{ t('actions.delete') }}</span>
            </HomeButton>
        </div>
        <FolderDialog
            v-if="isEditOpen"
            :mode="FolderDialogEnum.UPDATE"
            :isOpen="isEditOpen"
            :closeDialog="closeEditDialog"
            :onChanged="() => emit('changed')"
            :folderId="folderId"
            @searched="onSearch"
        />
    </div>
</template>
<script setup lang="ts">
import { IconFolder, IconEdit, IconDelete } from '@/assets/icons'
import { deleteFolder } from '~/apis/folders'
import { FolderDialogEnum } from '~/types'
import HomeButton from './HomeButton.vue'
import FolderDialog from '../folders/FolderDialog.vue'

const props = defineProps<{ title: string; folderId: string }>()

const emit = defineEmits(['changed', 'searched', 'deleted'])
const { t } = useI18n()

const {
    openDialog: openEditDialog,
    closeDialog: closeEditDialog,
    isOpen: isEditOpen,
} = useDialog()

const onEdit = () => {
    openEditDialog()
}
const onSearch = () => emit('searched')

const onDelete = async () => {
    try {
        await deleteFolder(props.folderId)
        emit('deleted')
    } catch (e) {
        console.error(e)
    }
}
</script>
