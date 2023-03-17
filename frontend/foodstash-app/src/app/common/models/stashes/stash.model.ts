import {StorageComplex, StorageCreate, StorageDetails} from '../storages/storage.model';

export interface StashDetails {
  id: number,
  name: string,
  ownerId: number,
  ownerUsername: string,
  personal: boolean,
  storages: StorageComplex[],
  numberOfStorages: number,
  hasWarning: boolean
}

export interface StashCreate {
  name: string,
  personal: boolean,
  storages: StorageCreate[]
}

export interface StashShare {
  shareEmail: string
}

export interface StashShareDetails{
  email: string,
  pending: boolean
}

export interface StashCollaborator {
  email: string,
  owner: boolean
}
