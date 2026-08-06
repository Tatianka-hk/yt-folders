<template>
    <DropDownMenu>
        <template #trigger="{ toggle }">
            <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-hoverbackground focus:outline-none focus:ring-2 focus:ring-slate-400 text-text"
                @click="toggle"
                aria-haspopup="menu"
            >
                <Icon3Points />
            </button>
        </template>
        <template #default="{ close }">
            <div class="overflow-hidden rounded-[10px]" role="none">
                <button
                    data-menu-item
                    class="flex w-full gap-2 items-center justify-between px-4 py-2 border-b border-text hover:text-slate-900 hover:bg-hoverblue focus:outline-none rounded-t-[10px]"
                    role="menuitem"
                    @click="
                        () => {
                            close()
                            onEdit()
                        }
                    "
                >
                    <IconEdit class="w-[24px] h-[24px] min-w-[24px]" />
                    <!-- <span class="text-2xl">{{ t('dropdown.edit') }}</span> -->
                </button>

                <button
                    data-menu-item
                    class="flex w-full gap-2 items-center text-rose-600 hover:text-rose-700 px-4 py-2 hover:bg-hoverblue focus:outline-none rounded-b-[10px]"
                    role="menuitem"
                    @click="onDelete"
                >
                    <IconDelete class="text-rose-600 w-[24px] h-[24px]" />
                    <!-- <span class="text-2xl">{{ t('dropdown.delete') }}</span> -->
                </button>
            </div>
            <FolderDialog
                v-if="isEditOpen"
                :mode="FolderDialogEnum.UPDATE"
                :isOpen="isEditOpen"
                :closeDialog="closeEditDialog"
                :onChanged="() => emit('changed')"
                :folderId="folderId"
            />
        </template>
    </DropDownMenu>
</template>

<script setup lang="ts">
import DropDownMenu from '~/ui/DropDownMenu.vue'
import FolderDialog from './FolderDialog.vue'
import { Icon3Points, IconEdit, IconDelete } from '~/assets/icons'
import { useDialog } from '~/composables/useDialog'
import { deleteFolder } from '~/apis/folders'
import { FolderDialogEnum } from '~/types'

const props = defineProps<{
    folderId: string
}>()

const emit = defineEmits(['changed'])
const { t } = useI18n()

const {
    openDialog: openEditDialog,
    closeDialog: closeEditDialog,
    isOpen: isEditOpen,
} = useDialog()

const onEdit = () => {
    openEditDialog()
}

const onDelete = async () => {
    try {
        await deleteFolder(props.folderId)
        emit('changed')
    } catch (e) {
        console.error(e)
    }
}
</script>
