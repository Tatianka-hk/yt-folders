import { Schema, model } from 'mongoose'

const FolderSchema = new Schema(
    {
        userId: Schema.Types.ObjectId,
        name: String,
        youtubeChannelsIDs: [
            {
                id: String,
                title: String,
                thumbnail: String,
            },
        ],
    },
    { bufferCommands: false }
)

export const Folder = model('Folder', FolderSchema)
