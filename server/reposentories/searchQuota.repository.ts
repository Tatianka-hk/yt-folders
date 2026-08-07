import { IUserSearch } from '~/types/user'
import { UserSearch } from '../models'
const MAX_USER_SEARCH_AMOUNT = process.env.NUXT_SEARCHES_PER_PROJECT_PER_DAY
export class SearchQuota {
    async getUserAmountSearch(userId: string, date?: Date): Promise<number> {
        if (!userId) {
            throw new Error('getUserNumberSearch: userId is required')
        }

        const { startOfDay, endOfDay } = this.getDayRange(date)

        const userSearch: IUserSearch | null = await UserSearch.findOne({
            userId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        })

        return userSearch != null ? userSearch.amount : 0
    }

    async incrementUserAmountSearch(
        userId: string,
        date?: Date
    ): Promise<void> {
        if (!userId) {
            throw new Error('incrementAmount: userId is required')
        }

        const targetDate = this.normalizeDate(date)

        await UserSearch.findOneAndUpdate(
            { userId, date: targetDate },
            { $inc: { amount: 1 } },
            { upsert: true, new: true }
        )
    }

    async reserveQuota(userId: string) {
        const today = new Date().setHours(0, 0, 0, 0)

        const userSearch = await UserSearch.findOne({
            userId,
            date: today,
        })
        const quota: number = userSearch ? userSearch.amount : 0

        if (quota >= Number(MAX_USER_SEARCH_AMOUNT)) {
            throw new Error('Limit reached')
            return
        }

        const result = await UserSearch.findOneAndUpdate(
            {
                userId: userId,
                date: today,
            },
            { $inc: { amount: 1 } },
            { upsert: true, new: true }
        )

        return result
    }

    async releaseQuota(userId: string) {
        const today = new Date().setHours(0, 0, 0, 0)
        await UserSearch.updateOne(
            { userId, date: today },
            { $inc: { amount: -1 } }
        )
    }

    private getDayRange(date?: Date) {
        const target = date ? new Date(date) : new Date()

        const startOfDay = new Date(target)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(target)
        endOfDay.setHours(23, 59, 59, 999)

        return { startOfDay, endOfDay }
    }

    private normalizeDate(date?: Date): Date {
        const target = date ? new Date(date) : new Date()
        target.setHours(0, 0, 0, 0)
        return target
    }
}

export const searchQuotaRepository = new SearchQuota()
