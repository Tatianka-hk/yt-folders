import { Schema, model } from 'mongoose'

const VerificationTokenSchema = new Schema(
    {
        userId: Schema.Types.ObjectId,
        token: String,
        createdAt: Date,
        expiresAt: Date,
    },
    { bufferCommands: false }
)

export const VerificationToken = model(
    'VerificationToken',
    VerificationTokenSchema
)
