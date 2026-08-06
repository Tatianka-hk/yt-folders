<script setup lang="ts">
import { useI18n } from '#imports'

import { IconUser } from '@/assets/icons'

const { t } = useI18n()
</script>

<template>
    <div
        aria-label="User"
        class="bg-blue text-text rounded-full flex items-center justify-center h-[56px] w-[56px]"
        @click="
            () => {
                $router.push('/home')
            }
        "
    >
        <IconUser class="size-9" />
    </div>
</template>
