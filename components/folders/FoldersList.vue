<template>
    <div
        class="w-full h-full flex flex-col items-center flex-1 relative max-w-[300px]"
    >
        <div class="w-full flex items-center justify-center gap-5">
            <h1 class="text-4xl text-text">
                {{ t('folder.folders') }}
            </h1>
            <VButton
                :onClick="openDialog"
                extraClass=" flex gap-1 !w-fit  whitespace-nowrap items-center" "
            >
                <IconPlus class="w-[24px] h-[24px]" />
                {{ t('actions.create') }}
            </VButton>
        </div>

        <FolderDialog
            :isOpen="isOpen"
            :closeDialog="closeDialog"
            v-if="isOpen"
            @changed="$emit('changed')"
            @searched="onSearch"
        />
        <ul
            class="mt-4 flex lg:flex-col gap-2 lg:overflow-y-auto h-full w-full relative overflow-x-auto"
        >
            <li
                @click="onSelectFolder(folder._id)"
                v-for="folder in folders"
                :key="folder._id"
                :class="['flex items-center gap-2 py-4 px-4 cursor-pointer h-fit hover:primaryHover', folder._id === selectedFolderId ? ' bg-primary' : ''].join(' ')"
            >
                <IconFolder class="text-text"/>
                <span class="text-text text-base">{{ folder.name }}</span>
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import { useI18n } from '#imports'

import { IconFolder, IconPlus } from '@/assets/icons'
import { useDialog } from '~/composables/useDialog'
import { VButton } from '~/ui'
import FolderDialog from './FolderDialog.vue'
import type { IFolder } from '~/types'

const { t } = useI18n()
const { isOpen, openDialog, closeDialog } = useDialog()

const props = defineProps<{
    folders: IFolder[]
    selectedFolderId: string
}>()
const emit = defineEmits<{
    (e: 'selected', id: string): void
    (e: 'searched'): void
    (e: 'changed'): void
}>()

const onSelectFolder = (id: string) => {
    emit('selected',  id)
}

const onSearch = () => {
    emit('searched')
}


</script>
