<template>
    <div ref="rootRef" class="relative w-full max-w-xl min-w-xl">
        <!-- Input / selected chips -->
        <span class="text-text text-base mb-2">
            Оберіть будь ласка Youtube</span
        >
        <div
            class="min-h-[44px] w-full rounded-lg border border-text/30 bg-secondary px-3 py-2 text-text flex flex-wrap gap-2 items-center cursor-text mt-2"
            :class="opened ? 'ring-2 ring-blue-400' : ''"
            @click="openAndFocus"
        >
            <template v-if="selectedOptions.length">
                <span
                    v-for="ch in selectedOptions"
                    :key="ch.id"
                    class="flex items-center gap-2 rounded-full bg-white/70 border border-text/20 px-2 py-1 text-sm"
                >
                    <img
                        v-if="ch.thumbnail"
                        :src="ch.thumbnail"
                        alt=""
                        class="h-5 w-5 rounded-full"
                    />
                    <span class="truncate max-w-[160px]">{{ ch.title }}</span>

                    <button
                        type="button"
                        class="ml-1 text-text/70 hover:text-text"
                        @click="remove(ch.id)"
                        aria-label="remove"
                    >
                        ✕
                    </button>
                </span>
            </template>
            <input
                ref="inputRef"
                v-model="query"
                type="text"
                class="flex-1 min-w-[120px] bg-transparent outline-none text-base"
                @focus="opened = true"
                @keydown.down.prevent="move(1)"
                @keydown.up.prevent="move(-1)"
                @keydown.enter.prevent="toggleHighlighted()"
                @keydown.esc.prevent="close()"
                @input="onInput"
            />
        </div>

        <!-- Dropdown -->
        <div
            v-if="opened"
            class="absolute z-20 mt-2 w-full rounded-lg border border-text/30 bg-secondary shadow-lg overflow-hidden"
        >
            <div class="max-h-[260px] overflow-y-auto">
                <button
                    v-for="(opt, idx) in filteredOptions"
                    :key="opt.id"
                    type="button"
                    class="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-thirty"
                    :class="idx === highlightedIndex ? 'bg-primary/20' : ''"
                    @mousemove="highlightedIndex = idx"
                    @click="toggle(opt.id)"
                >
                    <input
                        type="checkbox"
                        class="h-4 w-4"
                        :checked="isSelected(opt.id)"
                        @change.prevent
                    />
                    <img
                        v-if="opt.thumbnail"
                        :src="opt.thumbnail"
                        alt=""
                        class="h-8 w-8 rounded-full"
                    />

                    <div class="flex-1 min-w-0">
                        <div class="font-medium truncate">{{ opt.title }}</div>
                        <div class="text-sm text-text/60 flex gap-2">
                            <span v-if="opt.handle" class="truncate">{{
                                opt.handle
                            }}</span>
                            <span v-if="typeof opt.subscribers === 'number'">
                                · {{ formatSubs(opt.subscribers) }} subs
                            </span>
                        </div>
                    </div>
                </button>

                <div
                    v-if="!filteredOptions.length"
                    class="px-3 py-4 text-text/60"
                >
                    Нічого не знайдено
                </div>
            </div>

            <!-- Footer actions -->
            <div
                class="border-t border-text/10 px-3 py-2 flex items-center justify-between"
            >
                <button
                    type="button"
                    class="text-sm text-text/70 hover:text-text"
                    @click="clearAll"
                >
                    Очистити
                </button>

                <button
                    type="button"
                    class="text-sm rounded-md bg-blue px-3 py-1 text-white hover:opacity-90"
                    @click="close"
                >
                    Готово
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { IYoutubeChannelOption } from '@/types'

const props = defineProps<{
    options: IYoutubeChannelOption[]
    modelValue: string[]
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v: string[]): void
    (e: 'update:query', v: string): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const opened = ref(false)
const query = ref('')
const highlightedIndex = ref(0)

const selectedOptions = ref<IYoutubeChannelOption[]>([])

const filteredOptions = computed(() => {
    const q = query.value.trim().toLowerCase()
    const list = props.options

    if (!q) return list

    return list.filter((o) => {
        const hay = `${o.title} ${o.handle ?? ''}`.toLowerCase()
        return hay.includes(q)
    })
})

watch(filteredOptions, () => {
    highlightedIndex.value = 0
})

function openAndFocus() {
    opened.value = true
    queueMicrotask(() => inputRef.value?.focus())
}

function onInput() {
    emit('update:query', query.value)
}

function close() {
    opened.value = false
    query.value = ''
    highlightedIndex.value = 0
}

function isSelected(id: string) {
    return props.modelValue.includes(id)
}

function toggle(id: string) {
    const exists = isSelected(id)
    const next = exists
        ? props.modelValue.filter((x) => x !== id)
        : [...props.modelValue, id]
    emit('update:modelValue', next)
    selectedOptions.value = exists
        ? selectedOptions.value.filter((o) => o.id !== id)
        : [...selectedOptions.value, props.options.find((o) => o.id === id)]
    selectedOptions.value = selectedOptions.value
    if (!exists) {
        query.value = ''
        emit('update:query', '')
    }
    queueMicrotask(() => inputRef.value?.focus())
}

function remove(id: string) {
    emit(
        'update:modelValue',
        props.modelValue.filter((x) => x !== id)
    )
    selectedOptions.value = selectedOptions.value.filter((o) => o.id !== id)
}

function clearAll() {
    emit('update:modelValue', [])
    selectedOptions.value = []
    queueMicrotask(() => inputRef.value?.focus())
}

function move(delta: number) {
    if (!opened.value) opened.value = true
    const max = filteredOptions.value.length - 1
    if (max < 0) return
    highlightedIndex.value = Math.min(
        max,
        Math.max(0, highlightedIndex.value + delta)
    )
}

function toggleHighlighted() {
    const opt = filteredOptions.value[highlightedIndex.value]
    if (!opt) return
    toggle(opt.id)
}

function onBackspace(e: KeyboardEvent) {
    if (query.value.length) return
    // якщо поле пусте — backspace видаляє останній чип
    if (props.modelValue.length) {
        const last = props.modelValue[props.modelValue.length - 1]
        emit('update:modelValue', props.modelValue.slice(0, -1))
        e.preventDefault()
        queueMicrotask(() => inputRef.value?.focus())
    }
}

function onDocumentClick(e: MouseEvent) {
    const el = rootRef.value
    if (!el) return
    if (e.target instanceof Node && !el.contains(e.target)) close()
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))

function formatSubs(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return String(n)
}
</script>
