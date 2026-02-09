import { useState, onMounted } from '#imports'

export function useAuth() {
    const isAuth = useState<boolean>('isAuth', () => false)
    const userId = useState<string | null>('userId', () => null)

    async function fetchAuth() {
        try {
            const res = await $fetch<{ isAuth: boolean; userId?: string }>(
                '/api/me'
            )
            isAuth.value = res.isAuth
            userId.value = res.userId || null
        } catch {
            isAuth.value = false
            userId.value = null
        }
    }

    onMounted(fetchAuth)

    return { isAuth, userId, fetchAuth }
}
