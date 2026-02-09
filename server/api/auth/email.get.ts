import { User } from '~/server/models/User'
import connectDB from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const userId: string | undefined = event.context.userId
    if (!userId) {
        return createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        })
    }
    try {
        await connectDB()

        const user = await User.findOne({ _id: userId })
        if (!user) {
            return createError({
                statusCode: 404,
                statusMessage: 'User not found',
            })
        }
        return { email: user.email }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})
