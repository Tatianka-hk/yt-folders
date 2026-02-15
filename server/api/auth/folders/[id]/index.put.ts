import { Folder } from '~/server/models/Folder'
import connectDB from '../../../../utils/db'

export default defineEventHandler(async (event) => {
    const folderID: string | undefined = getRouterParam(event, 'id')
    if (!folderID) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing folder ID',
        })
    }
    const body = await readBody<{
        name: string
        youtubeChannelsIDs: string[]
    }>(event)

    const name = body?.name?.trim()?.toLowerCase()
    const userId = event.context.userId

    if (!userId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        })
    }

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing name',
        })
    }

    try {
        await connectDB()

        const folder = await Folder.findOneAndUpdate(
            { _id: folderID },
            {
                userId,
                name,
                youtubeChannelsIDs: body.youtubeChannelsIDs,
            }
        )

        if (!folder) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Folder not found',
            })
        }

        return { success: true }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})
