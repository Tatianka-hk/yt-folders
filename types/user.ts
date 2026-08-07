import type { Schema } from 'mongoose'

export interface IUser {
    email?: string
}

export interface IAuthCredentials {
    email: string
    password: string
}

export interface IUserSearch {
    userId: Schema.Types.ObjectId
    date: Date
    amount: number
}
