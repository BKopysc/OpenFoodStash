export interface StorageDetails{
  id: number,
  name: string,
  storageType: EStorageType
}

export interface StorageStashDetails{
  id: number,
  name: string,
  storageType: EStorageType,
  stashId: number,
  stashName: string
}

export interface StorageComplex extends  StorageStashDetails{
  activeFoodStats: number,
  alertsStats: number,
  ownerUsername: string
}

export interface StorageCreate {
  name: string,
  storageType: EStorageType
}

export enum EStorageType{
  "FRIDGE" = "FRIDGE",
  "FREEZER" = "FREEZER",
  "SHELF" = "SHELF",
  "OTHER" = "OTHER"
}

export interface StorageType{
  name: string,
  value: string
}

export const StorageTrans: Map<string, string> = new Map<string, string>([
  ['FRIDGE', 'storageType.fridge'],
  ['FREEZER', 'storageType.freezer'],
  ['SHELF', 'storageType.shelf'],
  ['OTHER', 'storageType.other']
]);

export const StorageTransArr = Array.from(StorageTrans, ([name, value]) => ({ name, value }));

// {name: 'storageType.fridge', value: "FRIDGE"};
// {name: 'storageType.freezer', value: "FREEZER"};
// {name: 'storageType.other', value: "OTHER"};
// )
