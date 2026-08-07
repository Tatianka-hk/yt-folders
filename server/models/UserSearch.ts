import { Schema, model } from 'mongoose'
import { IUserSearch } from '~/types'

const UserSearchSchema = new Schema<IUserSearch>(
    {
        userId: {
            type: Schema.Types.ObjectId || String,
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
UserSearchSchema.index({ userId: 1, date: 1 }, { unique: true })
export const UserSearch = model('UserSearch', UserSearchSchema)
