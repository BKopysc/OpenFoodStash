import {EFoodUnitType} from './food-unit-type.model';
import {FoodCategoryDetails} from './food-category.model';
import {keyframes} from '@angular/animations';

export interface FoodDetails {
  id: number,
  name: string,
  unitType: EFoodUnitType,
  initialUnitValue: number,
  unitValue: number,
  addedDate: Date,
  expirationDate: Date,
  processedDate: Date | null,
  eaten: boolean,
  open: boolean,
  alerted: boolean,
  //isUneatable: boolean,
  freshScore: number,
  status: EFoodStatus,
  foodCategoryDetailsDto: FoodCategoryDetails,
  storageId: number,
  left: number
}

export enum EFoodStatus {
  "FRESH" = "FRESH",
  "GOOD" = "GOOD",
  "NOTFRESH" = "NOTFRESH",
  "SPOILED" = "SPOILED",
  "TOTRY" = "TOTRY"
}

export enum EFoodStatusFilter {
  "ANY" = "ANY",
  "OUTDATED" = "OUTDATED",
  "ACTIVE" = "ACTIVE",
  "ALERTED" = "ALERTED"
}

export enum EFoodPlaceFilter{
  "TRASH" = "TRASH",
  "DELETED" = "DELETED",
  "EATEN" = "EATEN"
}

export const FoodStatusFilter = [
  {name: 'ANY', trans: 'foodStatusFilter.all'},
  {name: 'OUTDATED', trans: 'foodStatusFilter.outdated'},
  {name: 'ACTIVE', trans: 'foodStatusFilter.active'},
  {name: 'ALERTED', trans: 'foodStatusFilter.alerted'},
]

export const FoodPlaceFilter = [
  {name: 'TRASH', trans: 'historyFoodTable.filters.trash'},
  {name: 'DELETED', trans: 'historyFoodTable.filters.deleted'},
  {name: 'EATEN', trans: 'historyFoodTable.filters.eaten'}
]

//export const FoodPlaceFilterMap = new Map(Object.entries(FoodPlaceFilter));

export interface FoodFormModel {
  storageId: number,
  storageName: string,
  name: string,
  unitType: string,
  initialUnitValue: number,
  expirationDate: Date | null,
  category: number,
  autoPredict: boolean,
  isEaten: boolean,
  isOpen: boolean,
  //isUneatable: boolean,
  freshScore: number | null
}

export interface FoodCreateModel {
  name: string,
  unitType: string,
  initialUnitValue: number,
  expirationDate: Date | null,
  isEaten: boolean,
  isOpen: boolean,
  //isUneatable: boolean,
  freshScore: number | null,
  categoryId: number,
  storageId: number
}

export interface FoodConsumeModel {
  id: number,
  consumeAmount: number
}

export interface FoodEditModel {
  id: number,
  name: string,
  unitType: EFoodUnitType,
  initialUnitValue: number,
  unitValue: number,
  expirationDate: Date,
  isOpen: boolean,
  categoryId: number,
  storageId: number,
}

export interface FoodRequestParamsModel {
  eaten?: boolean,
  isOpen?: boolean | null,
  isAlerted?: boolean,
  inTrash?: boolean,
  deleted?: boolean
  foodStatus?: EFoodStatusFilter
}

