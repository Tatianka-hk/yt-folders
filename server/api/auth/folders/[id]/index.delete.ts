import connectDB from '../../../../utils/db'
import { Folder } from '~/server/models/Folder'

export default defineEventHandler(async (event) => {
    const folderID: string | undefined = getRouterParam(event, 'id')
    if (!folderID) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing folder ID',
        })
    }

    try {
        await connectDB()
        const folder = await Folder.findOneAndDelete({ _id: folderID })
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
