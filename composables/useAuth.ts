import { useState, onMounted } from '#imports'

export function useAuth() {
    const isAuthLoading = useState<boolean>('isAuthLoading', () => false)
    const isAuth = useState<boolean>('isAuth', () => false)
    const userId = useState<string | null>('userId', () => null)

    async function fetchAuth() {
        try {
            isAuthLoading.value = true
            const res = await $fetch<{ isAuth: boolean; userId?: string }>(
                '/api/me'
            )
            isAuth.value = res.isAuth
            userId.value = res.userId || null
        } catch {
            isAuth.value = false
            userId.value = null
        } finally {
            isAuthLoading.value = false
        }
    }

    onMounted(fetchAuth)

    return { isAuth, userId, fetchAuth, isAuthLoading }
}
