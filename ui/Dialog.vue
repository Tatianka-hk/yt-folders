<template>
    <Teleport to="#caps">
        <div
            class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 overflow-y-hidden"
        >
            <div
                aria-modal="true"
                role="dialog"
                :class="[
                    'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-[40px] px-[80px]',
                    mode === 'error' ? 'bg-blue' : 'bg-primary',
                    classString,
                ]"
            >
                <button
                    :class="[
                        'absolute -top-2 -right-2 rounded-full p-1',
                        mode === 'error' ? 'bg-primary' : 'bg-blue',
                        isOpen ? 'block' : 'hidden',
                    ]"
                >
                    <IconClose @click="onClose" />
                </button>
                <slot />
            </div>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { IconClose } from '~/assets/icons'

const props = withDefaults(
    defineProps<{
        onClose: () => void
        isOpen: boolean
        mode?: 'default' | 'error'
        classString?: string
    }>(),
    {
        mode: 'default',
        classString: '',
    }
)

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.isOpen) {
        props.onClose()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
})
</script>
