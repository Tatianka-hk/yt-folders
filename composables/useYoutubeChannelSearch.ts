import { computed, ref, watch } from 'vue'
import type { IYoutubeChannelOption } from '~/types'

type UseYoutubeChannelSearchOpts = {
    debounceMs?: number
    maxResults?: number
    minQueryLength?: number
    cacheTtlMs?: number
}

type CacheEntry = { ts: number; data: IYoutubeChannelOption[] }

export function useYoutubeChannelSearch(
    opts: UseYoutubeChannelSearchOpts = {}
) {
    const debounceMs = opts.debounceMs ?? 800
    const maxResults = opts.maxResults ?? 10
    const minQueryLength = opts.minQueryLength ?? 2
    const cacheTtlMs = opts.cacheTtlMs ?? 5 * 60_000 // 5 хв

    const query = ref('')
    const loading = ref(false)
    const error = ref<string | null>(null)
    const results = ref<IYoutubeChannelOption[]>([])

    const cache = new Map<string, CacheEntry>()
    let t: ReturnType<typeof setTimeout> | null = null
    let abort: AbortController | null = null

    const canSearch = computed(
        () => query.value.trim().length >= minQueryLength
    )

    async function fetchChannels(q: string) {
        const key = q.trim().toLowerCase()

        // cache hit
        const hit = cache.get(key)
        if (hit && Date.now() - hit.ts < cacheTtlMs) {
            results.value = hit.data
            return
        }

        // abort previous
        abort?.abort()
        abort = new AbortController()

        loading.value = true
        error.value = null

        try {
            const data = await $fetch<IYoutubeChannelOption[]>(
                '/api/youtube/channels',
                {
                    query: { q, maxResults },
                    signal: abort.signal,
                }
            )

            results.value = data ?? []
            cache.set(key, { ts: Date.now(), data: results.value })
        } catch (e: any) {
            if (e?.name === 'AbortError') return
            error.value = e?.statusMessage || e?.message || 'YouTube API error'
        } finally {
            loading.value = false
        }
    }

    watch(
        () => query.value,
        (val) => {
            if (t) clearTimeout(t)
            if (!val.trim() || val.trim().length < minQueryLength) {
                results.value = []
                error.value = null
                abort?.abort()
                loading.value = false
                return
            }

            t = setTimeout(() => fetchChannels(val), debounceMs)
        }
    )

    function clear() {
        query.value = ''
        results.value = []
        error.value = null
        abort?.abort()
        loading.value = false
    }

    return {
        query,
        results,
        loading,
        error,
        canSearch,
        clear,
    }
}
