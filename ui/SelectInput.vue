<template>
    <div
        ref="rootRef"
        class="relative text-text text-base bg-primary rounded-lg w-fit h-full"
    >
        <div
            class="flex gap-1 py-2 px-4 cursor-pointer items-center justify-between"
            @click="onClick"
        >
            {{ findSelectedOption(value) }}
            <IconChevronUp v-if="opened" />
            <IconChevronDown v-else />
        </div>
        <ul
            v-if="opened"
            class="absolute top-full left-0 z-10 mt-1 w-full bg-white border border-text rounded-lg shadow-md max-h-[200px] overflow-y-scroll"
        >
            <li
                v-for="option in options"
                :key="option.value"
                :class="[
                    'py-2 px-4 cursor-pointer',
                    dialogMode
                        ? 'bg-blue hover:bg-[#cfdae6]'
                        : ' bg-primary hover:bg-thirty',
                ]"
                @click="onOptionClick(option.value)"
            >
                {{ option.label }}
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { IconChevronDown, IconChevronUp } from '../assets/icons'
const rootRef = ref<HTMLElement | null>(null)

type valueType = string | number
type OptionType = {
    label: string
    value: valueType
}
interface PropsType {
    options: OptionType[]
    value: valueType
    dialogMode?: boolean
}
const emit = defineEmits<{
    (e: 'change', val: valueType): void
}>()

const props = withDefaults(defineProps<PropsType>(), {
    dialogMode: false,
})

const opened = ref<boolean>(false) //interesting

const onClick = () => {
    opened.value = !opened.value
}

const findSelectedOption = (val: valueType): string => {
    return (
        props?.options?.find((option: OptionType) => option.value === val)
            ?.label || ''
    )
}

const onOptionClick = (val: valueType) => {
    emit('change', val)
    opened.value = false
}
const handleClickOutside = (event: MouseEvent) => {
    if (!opened.value) return
    if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
        opened.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>
