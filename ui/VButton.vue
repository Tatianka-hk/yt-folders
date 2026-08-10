<template>
    <button
        type="button"
        :aria-label="ariaLabel"
        @click="ifClicked"
        :class="[
            'p-4 text-text text-base rounded-lg',
            variant === BUTTON_VARIANT.PRIMARY
                ? disabled
                    ? ' bg-primaryDisabled cursor-not-allowed'
                    : 'bg-primary hover:bg-primaryHover cursor-pointer'
                : disabled
                  ? ' bg-secondaryDisabled cursor-not-allowed'
                  : 'bg-secondary hover:bg-secondaryHover ',
            extraClass,
        ]"
        :disabled="disabled"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
import { BUTTON_VARIANT } from '~/static'

// disabled
//                 ? 'bg-[#d8c3c2] text-[#0d0d12] cursor-not-allowed'
//                 : 'bg-primary hover:bg-thirty/60 cursor-pointer',

const props = withDefaults(
    defineProps<{
        onClick: () => void
        disabled?: boolean
        extraClass?: string
        ariaLabel?: string
        variant?: BUTTON_VARIANT
    }>(),
    {
        disabled: false,
        variant: BUTTON_VARIANT.PRIMARY,
    }
)

const ifClicked = (): void => {
    if (!props.disabled) {
        props.onClick()
    }
}
</script>
