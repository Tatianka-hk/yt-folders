export interface IChannel {
    id: string
    title: string
    thumbnail: string
}

export interface IFolder {
    _id: string
    userID: string
    name: string
    youtubeChannelsIDs: IChannel[]
}

export enum FolderActionsEnum {
    CREATE = 'add',
    UPDATE = 'update',
    DELETE = 'delete',
}

export enum FolderDialogEnum {
    CREATE = 'add',
    UPDATE = 'update',
}
