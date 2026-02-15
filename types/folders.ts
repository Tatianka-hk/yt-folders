export interface IFolder {
    _id: string
    userID: string
    name: string
    youtubeChannelsIDs: string[]
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
