<template>
    <button
        type="button"
        @click="ifClicked"
        :class="[
            'p-4 text-text text-base rounded-lg',
            disabled
                ? 'bg-[#d8c3c2] cursor-not-allowed'
                : 'bg-primary hover:bg-thirty/60 cursor-pointer',
            extraClass,
        ]"
        :disabled="disabled"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        onClick: () => void
        disabled?: boolean
        extraClass?: string
    }>(),
    {
        disabled: false,
    }
)

const ifClicked = (): void => {
    if (!props.disabled) {
        props.onClick()
    }
}
</script>
