<template>
    <div class="flex flex-col">
        <label v-if="label" :for="inputId" class="font-julius text-base mb-2">{{
            label
        }}</label>

        <input
            :id="inputId"
            :name="name"
            :type="type"
            :value="modelValue"
            @input="onInput"
            v-bind="attrs"
            class="w-full border border-text bg-blue py-2 px-4 "
        />
    </div>
</template>

<script setup lang="ts">
import { useAttrs, computed } from 'vue'

const props = withDefaults(
    defineProps<{
        modelValue: string | number
        label?: string
        type?: string
        name?: string
        id?: string
    }>(),
    {
        type: 'text',
    }
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
}>()

const attrs = useAttrs()

const inputId = computed(
    () =>
        props.id ||
        props.name ||
        `fld-${Math.random().toString(36).slice(2, 9)}`
)

function onInput(e: Event) {
    const el = e.target as HTMLInputElement
    emit('update:modelValue', el.value)
}
</script>
