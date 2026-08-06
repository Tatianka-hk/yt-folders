import { Schema, model } from 'mongoose'
import { UserStatusEnum } from '~/static/user'
const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        password: String,
        createdAt: Date,
        emailStatus: {
            type: String,
            enum: Object.values(UserStatusEnum),
            default: UserStatusEnum.PENDING,
            required: true,
        },
    },
    { bufferCommands: false }
)

export const User = model('User', UserSchema)
