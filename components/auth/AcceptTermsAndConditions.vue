<template>
    <label class="flex items-start gap-3 cursor-pointer mb-3">
        <input
            :checked="modelValue"
            type="checkbox"
            class="mt-1 h-4 w-4 cursor-pointer"
            @change="onChange"
        />

        <span class="text-sm text-text/70">
            {{ t('auth.policy.prefix') }}

            <span
                class="text-white underline hover:opacity-80"
                @click="goToRoute('terms')"
            >
                {{ t('auth.policy.terms') }}
            </span>

            {{ t('auth.policy.and') }}

            <span
                @click="goToRoute('terms')"
                class="text-white underline hover:opacity-80"
            >
                {{ t('auth.policy.privacy') }} </span
            >.
        </span>
    </label>
</template>
<script setup lang="ts">
import { useCustomRoute, useI18n } from '#imports'
const { goToRoute } = useCustomRoute()
const { t } = useI18n()

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement

    emit('update:modelValue', target.checked)
}
</script>
