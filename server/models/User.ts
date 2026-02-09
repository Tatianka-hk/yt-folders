import { Schema, model } from 'mongoose'

const UserSchema = new Schema(
    {
        email: String,
        password: String,
        createdAt: Date,
    },
    { bufferCommands: false }
)

export const User = model('User', UserSchema)
