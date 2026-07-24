import type { IAction, IChannel, IFolder } from '~/types'
import { apiRequest } from './api'

const PREFIX = '/auth/folders'

export function createFolder(
    name: string,
    youtubeChannelsIDs: IChannel[]
): Promise<IAction> {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}`,
        data: {
            name,
            youtubeChannelsIDs,
        },
    })
}

export function getFolders(): Promise<{ folders: IFolder[] }> {
    return apiRequest({
        method: 'GET',
        url: `${PREFIX}`,
    })
}

export function deleteFolder(id: string): Promise<IAction> {
    return apiRequest({
        method: 'DELETE',
        url: `${PREFIX}/${id}`,
    })
}

export function updateFolder(
    id: string,
    name: string,
    youtubeChannelsIDs: IChannel[]
): Promise<IAction> {
    return apiRequest({
        method: 'PUT',
        url: `${PREFIX}/${id}`,
        data: { name, youtubeChannelsIDs },
    })
}

export function getFolder(id: string): Promise<{ folder: IFolder }> {
    return apiRequest({
        method: 'GET',
        url: `${PREFIX}/${id}`,
    })
}
