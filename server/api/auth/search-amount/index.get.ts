import { searchQuotaRepository } from '~/server/reposentories/searchQuota.repository'
import connectDB from '../../../utils/db'

export default defineEventHandler(async (event) => {
    try {
        await connectDB()
        const userId = event.context.userId
        if (!userId) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
            })
        }

        const searchAmount: number =
            await searchQuotaRepository.getUserAmountSearch(
                event.context.userId
            )

        return { amount: searchAmount }
    } catch (err: any) {
        console.error('/search-amount.get:', err)
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})
