export default defineEventHandler((event) => {
    const userId: string | undefined = event.context.userId
    if (!userId) {
        return { isAuth: false }
    }

    return { isAuth: true, userId }
})
