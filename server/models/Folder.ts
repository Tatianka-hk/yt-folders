import { Schema, model } from 'mongoose'

const FolderSchema = new Schema(
    {
        userId: Schema.Types.ObjectId,
        name: String,
        youtubeChannelsIDs: [String],
    },
    { bufferCommands: false }
)

export const Folder = model('Folder', FolderSchema)
