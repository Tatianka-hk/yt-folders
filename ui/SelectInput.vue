<template>
    <div
        ref="rootRef"
        class="relative text-text text-base bg-primary rounded-lg w-fit h-full"
    >
        <div
            class="flex gap-1 py-2 px-4 cursor-pointer items-center justify-between h-full"
            @click="onClick"
        >
            {{ selectedLabel }}
            <IconChevronUp @click.stop="onClick" v-if="opened" />
            <IconChevronDown @click.stop="onClick" v-else />
        </div>
        <ul
            v-if="opened"
            class="absolute top-full left-0 z-10 mt-1 w-full bg-white border border-text rounded-lg shadow-md max-h-[220px] overflow-y-auto"
        >
            <li
                v-for="option in options"
                :key="option.value"
                :class="[
                    'py-2 px-4 cursor-pointer',
                    dialogMode
                        ? 'bg-blue hover:bg-[#cfdae6]'
                        : ' bg-primary hover:bg-primaryHover',
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

const opened = ref<boolean>(false)

const selectedLabel = computed(
    () => props.options.find((o) => o.value === props.value)?.label ?? ''
)

const onClick = () => {
    opened.value = !opened.value
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
