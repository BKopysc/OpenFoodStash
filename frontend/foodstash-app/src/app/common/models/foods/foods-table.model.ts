export interface FoodsTableModel {
  id: number,
  name: string,
  left: string,
  expirationDate: Date,
  status: string
}

export interface FoodsUpdateEmitterModel {
  itemsCount: number,
  alertsCount: number
}

export enum EFoodTableMobileAction{
  "EAT",
  "DELETE",
  "EDIT",
  "DETAILS"
}

export interface FoodTableMobileButtons{
  icon: string,
  enumAction: EFoodTableMobileAction
}

export interface FoodTableSorterElem{
  value: string,
  transLabel: string,
}

export interface FoodTableSorterEmitter{
  value: string,
  direction: 'asc' | 'desc'
}

export interface FoodTableMobileButtonEmitters{
  foodId: number,
  enumAction: EFoodTableMobileAction
}
