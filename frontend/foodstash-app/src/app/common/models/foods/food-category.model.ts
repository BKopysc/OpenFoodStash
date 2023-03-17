
export interface FoodCategoryDetails {
  id: number,
  name: string,
  strongExpirationDate: boolean
}

export const FoodCategoryTransMap: Map<string, string> = new Map<string,string>([
  ['DRINK', 'foodCategory.label.drink'],
  ['SAUCE', 'foodCategory.label.sauce'],
  ['MEAT', 'foodCategory.label.meat'],
  ['BREAD', 'foodCategory.label.bread'],
  ['DAIRY', 'foodCategory.label.dairy'],
  ['SWEETS', 'foodCategory.label.sweets'],
  ['OTHER', 'foodCategory.label.other'],
  ['FRUIT', 'foodCategory.label.fruit'],
  ['VEGETABLE', 'foodCategory.label.vegetable'],
  ['MEAL', 'foodCategory.label.meal']
])

export const FoodCategoryTransArr = Array.from(FoodCategoryTransMap, ([name,trans]) => ({name, trans}));
