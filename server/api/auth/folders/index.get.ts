import { Folder } from '~/server/models/Folder'
import { User } from '~/server/models/User'
import connectDB from '~/server/utils/db'
import { IFolder } from '~/types'

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

        const folders: IFolder[] = await Folder.find({ userId })
        if (!folders) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Folders are not found',
            })
        }
        return { folders }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})
