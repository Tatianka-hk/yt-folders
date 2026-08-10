<template>
    <button
        @click="onClick"
        type="button"
        :aria-label="ariaLabel"
        class="border border-1 border-text p-4 text-text flex gap-2 items-center rounded-[10px] hover:bg-text/50 cursor-pointer"
    >
        <slot />
    </button>
</template>
<script setup lang="ts">
const props = defineProps<{ onClick: () => void; ariaLabel: string }>()
</script>
