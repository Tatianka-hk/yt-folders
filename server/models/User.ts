import { Schema, model } from 'mongoose'
import { UserStatusEnum } from '~/static/user'
const UserSchema = new Schema(
    {
        email: String,
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
