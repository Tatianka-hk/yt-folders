import { apiRequest } from './api'

const PREFIX = '/auth'

export type AuthUserType = {
    email: string
    password: string
    locale?: string
}

export function registerUser(data: AuthUserType) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/register`,
        data,
    })
}

export function login(data: AuthUserType) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/login`,
        data,
    })
}

export function logout() {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/logout`,
    })
}

export function getEmail() {
    return apiRequest({
        method: 'GET',
        url: `${PREFIX}/email`,
    })
}

export function verifyEmail(token: string) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/verify-email`,
        data: { token },
    })
}

export function resendVerification(data: { email: string; locale?: string }) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/resend-verify-email`,
        data: data,
    })
}

export const resetPassword = (data: { email: string; locale?: string }) => {
    return $fetch('/api/auth/reset-password', {
        method: 'POST',
        body: data,
    })
}
