import { apiRequest } from './api'

const PREFIX = '/auth'

export type AuthUserType = {
    email: string
    password: string
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
