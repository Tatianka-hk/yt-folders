import { Schema, model } from 'mongoose'

const UserSearchchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { bufferCommands: false }
)

export const UserSearch = model('UserSearch', UserSearchchema)
