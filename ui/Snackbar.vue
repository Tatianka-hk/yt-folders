<template>
    <div
        v-if="message"
        id="snackbar"
        :class="[
            'fixed bottom-5 left-1/2 transform -translate-x-1/2 text-white px-5 py-3 rounded z-[1000] transition-all duration-300',
            message.type === 'success' && 'bg-mint',
            message.type === 'error' && 'bg-error',
        ]"
    >
        {{ message.message }}
    </div>
</template>

<script setup lang="ts">
import { useSnackbar } from '~/composables/useSnackbar'
import { computed } from 'vue'

const { currentMessage } = useSnackbar()
const message = computed(() => currentMessage.value)
</script>
