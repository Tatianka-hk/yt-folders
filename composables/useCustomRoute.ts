export const useCustomRoute = () => {
    const localeRoute = useLocaleRoute()

    const goToRoute = (name: string) => {
        const route = localeRoute({ name })

        if (!route) return

        return navigateTo(route.fullPath)
    }

    return { goToRoute }
}
