<template>
    <div
        class="relative inline-flex group"
        @mouseenter="isVisible = true"
        @mouseleave="isVisible = false"
        @focusin="isVisible = true"
        @focusout="isVisible = false"
    >
        <!-- First child: visible content -->
        <slot name="trigger" />

        <!-- Second child: tooltip -->
        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
        >
            <div
                v-if="isVisible"
                role="tooltip"
                class="absolute z-50 bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-max max-w-[280px] rounded-lg bg-text px-3 py-2 text-xs text-secondary shadow-lg"
            >
                <slot name="content" />

                <div
                    class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-text"
                />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isVisible = ref(false)
</script>
