const PREFIX = '/api/support'

export interface SupportBody {
    email?: string
    message?: string
}
export const sendSupport = (data: SupportBody): any => {
    return $fetch(PREFIX, {
        method: 'POST',
        body: data,
    })
}
