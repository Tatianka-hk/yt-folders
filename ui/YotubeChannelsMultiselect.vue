<template>
    <div ref="rootRef" class="relative w-full max-w-xl min-w-xl">
        <span class="text-text text-base mb-2">
            {{ t('folder.chooseChannels') }}
        </span>

        <!-- Selected channels -->
        <div
            v-if="modelValue.length"
            class="w-full flex flex-wrap gap-2 items-center mt-2 mb-2"
        >
            <span
                v-for="ch in modelValue"
                :key="ch.id"
                class="flex items-center gap-2 rounded-full bg-white/70 border border-text/20 px-2 py-1 text-sm"
            >
                <img
                    v-if="ch.thumbnail"
                    :src="ch.thumbnail"
                    alt=""
                    class="h-5 w-5 rounded-full"
                />

                <span class="truncate max-w-[160px]">
                    {{ ch.title }}
                </span>

                <button
                    type="button"
                    class="ml-1 text-text/70 hover:text-text"
                    aria-label="Remove channel"
                    @click.stop="remove(ch.id)"
                >
                    ✕
                </button>
            </span>
        </div>

        <!-- Search input -->
        <div
            class="w-full rounded-lg border border-text/30 bg-secondary px-3 py-2 text-text flex items-center gap-2 mt-2"
            :class="opened ? 'ring-2 ring-blue-400' : ''"
        >
            <input
                ref="inputRef"
                v-model="query"
                type="text"
                class="flex-1 min-w-0 bg-transparent outline-none text-base"
                :placeholder="t('actions.search')"
                @focus="opened = true"
                @keydown.enter.prevent="search"
                @keydown.down.prevent="move(1)"
                @keydown.up.prevent="move(-1)"
                @keydown.esc.prevent="close"
            />

            <button
                type="button"
                class="shrink-0 rounded-md bg-blue px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
                :disabled="!query.trim()"
                @click="search"
            >
                {{ t('actions.search') }}
            </button>
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
                        class="h-4 w-4 pointer-events-none"
                        :checked="isSelected(opt.id)"
                        tabindex="-1"
                    />

                    <img
                        v-if="opt.thumbnail"
                        :src="opt.thumbnail"
                        alt=""
                        class="h-8 w-8 rounded-full"
                    />

                    <div class="flex-1 min-w-0">
                        <div class="font-medium truncate">
                            {{ opt.title }}
                        </div>

                        <div class="text-sm text-text/60 flex gap-2">
                            <span v-if="opt.handle" class="truncate">
                                {{ opt.handle }}
                            </span>

                            <span v-if="typeof opt.subscribers === 'number'">
                                · {{ formatSubs(opt.subscribers) }} subs
                            </span>
                        </div>
                    </div>
                </button>

                <div
                    v-if="hasSearched && !filteredOptions.length"
                    class="px-3 py-4 text-text/60"
                >
                    {{ t('notFound') }}
                </div>

                <div v-else-if="!hasSearched" class="px-3 py-4 text-text/60">
                    {{ t('folder.enterChannelAndSearch') }}
                </div>
            </div>

            <!-- Footer -->
            <div
                class="border-t border-text/10 px-3 py-2 flex items-center justify-between"
            >
                <button
                    type="button"
                    class="text-sm text-text/70 hover:text-text"
                    @click="clearAll"
                >
                    {{ t('actions.clear') }}
                </button>

                <button
                    type="button"
                    class="text-sm rounded-md bg-blue px-3 py-1 text-white hover:opacity-90"
                    @click="close"
                >
                    {{ t('actions.done') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IChannel, IYoutubeChannelOption } from '@/types'

const props = defineProps<{
    options: IYoutubeChannelOption[]
    modelValue: IChannel[]
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: IChannel[]): void
    (e: 'update:query', value: string): void
}>()

const { t } = useI18n()

const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const opened = ref(false)
const query = ref('')
const searchQuery = ref('')
const hasSearched = ref(false)
const highlightedIndex = ref(0)

const filteredOptions = computed(() => {
    if (!hasSearched.value) {
        return []
    }

    const normalizedQuery = searchQuery.value.trim().toLowerCase()

    if (!normalizedQuery) {
        return []
    }

    return props.options.filter((option) => {
        const searchableText = [option.title, option.handle ?? '']
            .join(' ')
            .toLowerCase()

        return searchableText.includes(normalizedQuery)
    })
})

watch(filteredOptions, () => {
    highlightedIndex.value = 0
})

function search() {
    const normalizedQuery = query.value.trim()

    if (!normalizedQuery) {
        searchQuery.value = ''
        hasSearched.value = false
        emit('update:query', '')
        return
    }

    searchQuery.value = normalizedQuery
    hasSearched.value = true
    opened.value = true
    highlightedIndex.value = 0

    emit('update:query', normalizedQuery)
}

function close() {
    opened.value = false
    query.value = ''
    searchQuery.value = ''
    hasSearched.value = false
    highlightedIndex.value = 0

    emit('update:query', '')
}

function isSelected(id: string) {
    return props.modelValue.some((channel) => channel.id === id)
}

function toggle(id: string) {
    const exists = isSelected(id)

    if (exists) {
        emit(
            'update:modelValue',
            props.modelValue.filter((channel) => channel.id !== id)
        )
    } else {
        const selectedOption = props.options.find((option) => option.id === id)

        if (!selectedOption) {
            return
        }

        emit('update:modelValue', [...props.modelValue, selectedOption])
    }

    queueMicrotask(() => inputRef.value?.focus())
}

function remove(id: string) {
    emit(
        'update:modelValue',
        props.modelValue.filter((channel) => channel.id !== id)
    )
}

function clearAll() {
    emit('update:modelValue', [])
    queueMicrotask(() => inputRef.value?.focus())
}

function move(delta: number) {
    if (!opened.value) {
        opened.value = true
    }

    const maxIndex = filteredOptions.value.length - 1

    if (maxIndex < 0) {
        return
    }

    highlightedIndex.value = Math.min(
        maxIndex,
        Math.max(0, highlightedIndex.value + delta)
    )
}

function onDocumentClick(event: MouseEvent) {
    const rootElement = rootRef.value

    if (!rootElement) {
        return
    }

    if (event.target instanceof Node && !rootElement.contains(event.target)) {
        close()
    }
}

function formatSubs(value: number) {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`
    }

    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`
    }

    return String(value)
}

onMounted(() => {
    document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick)
})
</script>
