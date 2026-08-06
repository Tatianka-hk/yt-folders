<template>
    <div class="relative inline-block text-left" ref="root">
        <slot name="trigger" :open="open" :toggle="toggle">
            <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-hoverbackground focus:outline-none focus:ring-2 focus:ring-slate-400 text-text"
                @click="toggle"
                aria-haspopup="menu"
            >
                <Icon3Points />
            </button>
        </slot>

        <!-- Menu -->
        <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <div
                v-show="open"
                ref="menu"
                :class="[
                    'absolute z-50 mt-2 rounded-[10px] bg-secondary shadow-lg ring-1 ring-black/5',
                    alignClass,
                    menuClass,
                ]"
                role="menu"
                aria-orientation="vertical"
                tabindex="-1"
                @keydown.esc.stop.prevent="close()"
                @keydown.up.prevent="focusPrev()"
                @keydown.down.prevent="focusNext()"
            >
                <slot :close="close" />
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { Icon3Points } from '~/assets/icons'

const props = withDefaults(
    defineProps<{
        align?: 'left' | 'right'
        menuClass?: string
        autoFocusIndex?: number
    }>(),
    {
        align: 'right',
        menuClass: 'w-42',
        autoFocusIndex: 0,
    }
)

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const items = ref<HTMLElement[]>([])

const alignClass = computed(() => (props.align === 'right' ? '' : 'left-0'))

const collectItems = () => {
    items.value = menu.value
        ? Array.from(
              menu.value.querySelectorAll<HTMLElement>('[data-menu-item]')
          )
        : []
}

const focusByIndex = (i: number) => {
    if (!items.value.length) return
    const idx = (i + items.value.length) % items.value.length
    items.value[idx]?.focus()
}

const focusNext = () => {
    const active = document.activeElement as HTMLElement | null
    const idx = items.value.findIndex((el) => el === active)
    focusByIndex((idx === -1 ? -1 : idx) + 1)
}
const focusPrev = () => {
    const active = document.activeElement as HTMLElement | null
    const idx = items.value.findIndex((el) => el === active)
    focusByIndex((idx === -1 ? 1 : idx) - 1)
}

const toggle = async () => {
    open.value = !open.value
    if (open.value) {
        await nextTick()
        collectItems()
        focusByIndex(props.autoFocusIndex)
    }
}
const close = () => (open.value = false)

const onClickOutside = (e: MouseEvent) => {
    if (!root.value?.contains(e.target as Node)) close()
}
onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

watch(open, (v) => {
    if (v) {
        nextTick(collectItems)
    }
})
</script>
