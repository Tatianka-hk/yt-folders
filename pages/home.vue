<template>
    <div class="w-full h-full flex items-center flex-col">
        <div class="w-full flex items-center">
            <Logo />
        </div>
        <div class="w-full h-full flex">
            <FoldersList />
        </div>
    </div>
</template>
<script setup lang="ts">
import { Logo } from '../ui'

const { t } = useI18n()
</script>
