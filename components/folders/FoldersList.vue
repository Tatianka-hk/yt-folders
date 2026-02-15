<template>
    <div class="w-full h-full flex flex-col items-center">
        <div class="w-full flex items-center justify-between gap-2">
            <h1 class="text-4xl font-bold">Folders</h1>
            <VButton :onClick="openDialog">CREATE</VButton>
        </div>

        <FolderDialog
            :isOpen="isOpen"
            :closeDialog="closeDialog"
            v-if="isOpen"
            @changed="getUserFolders"
        />
        <ul class="mt-4 flex flex-col gap-2 overflow-y-auto h-full w-full">
            <li
                v-for="folder in folders"
                :key="folder.id"
                class="flex items-center gap-2 py-2 px-4 cursor-pointer bg-primary hover:bg-thirty max-w-[200px]"
            >
                <IconFolder />
                <span class="text-text text-base">{{ folder.name }}</span>
                <DropDownMenuFolder
                    :folderId="folder._id"
                    @changed="getUserFolders"
                />
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { IFolder } from '~/types'
import { IconFolder } from '@/assets/icons'
import DropDownMenuFolder from './DropDownMenuFolder.vue'
import { useDialog } from '~/composables/useDialog'
import { VButton } from '~/ui'
import FolderDialog from './FolderDialog.vue'
import { getFolders } from '~/apis/folders'

const { isOpen, openDialog, closeDialog } = useDialog()
const folders = ref<IFolder[]>([])

const getUserFolders = () => {
    getFolders().then((r) => (folders.value = r.folders))
}

onMounted(async () => {
    getUserFolders()
})
</script>
