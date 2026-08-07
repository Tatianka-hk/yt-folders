import { apiRequest } from './api'

const PREFIX = '/auth'

export function getUserAmountSearch(): Promise<{ amount: number }> {
    return apiRequest({
        method: 'GET',
        url: `${PREFIX}/search-amount`,
    })
}
