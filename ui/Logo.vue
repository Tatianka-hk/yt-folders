<template>
    <div
        :class="
            [
                'text-text w-full flex justify-center items-center font-bold',
                clasProps,
                size === Size.small
                    ? 'text-2xl'
                    : size === Size.medium
                      ? 'text-3xl'
                      : 'text-4xl',
            ].join(' ')
        "
    >
        YOUTUBE CARPETS
    </div>
</template>
<script setup lang="ts">
import { Size } from '../types'

withDefaults(
    defineProps<{
        clasProps?: string
        size?: Size
    }>(),
    {
        clasProps: '',
        size: Size.large,
    }
)
</script>
