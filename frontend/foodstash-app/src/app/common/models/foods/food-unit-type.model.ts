
export enum EFoodUnitType{
  "ML"= "ML",
  "L" = "L",
  "G"="G",
  "KG"="KG",
  "PCS"="PCS",
  "NONE"="NONE"
}

export interface FoodUnitType{
  name: string,
  trans: string
}

export const FoodUnitTypeArr: FoodUnitType[] = [
  {name: 'ML', trans: 'foodUnitType.ml'},
  {name: 'L', trans: 'foodUnitType.l'},
  {name: 'G', trans: 'foodUnitType.g'},
  {name: 'KG', trans: 'foodUnitType.kg'},
  {name: 'PCS', trans: 'foodUnitType.pcs'},
]

export const FoodUnitTypeTrans: Map<string | undefined, string> = new Map<string | undefined, string>([
  ['ML', 'foodUnitType.ml'],
  ['L', 'foodUnitType.l'],
  ['G', 'foodUnitType.g'],
  ['KG', 'foodUnitType.kg'],
  ['PCS', 'foodUnitType.pcs'],
  ['NONE', 'foodUnitType.none'],
  [undefined, 'foodUnitType.none']
]);

// export const FoodUnitTypeArr: FoodUnitType[] = Array.from(FoodUnitTypeTrans,
//   ([name, trans]) => ({name, trans}));
