import {HttpParams} from '@angular/common/http';
import {EFoodPlaceFilter, EFoodStatusFilter, FoodRequestParamsModel} from '../models/foods/foods.model';

export function FoodPageHttpParams(
  pageNumber = 0,
  pageSize = 10,
  sortOrder = 'asc',
  sortColumn = 'id',
  filterData?: string[],
  foodCategoryIds?: number[],
  foodRequestParams?: FoodRequestParamsModel
) {
  const sortParam = `${sortColumn},${sortOrder}`
  let params = new HttpParams()
    .set('page', pageNumber)
    .set('size', pageSize)
    .set('sort', sortParam)

  filterData?.forEach( f => {
    params = params.append('filterData', f)
  });
  foodCategoryIds?.forEach( f => {
    params = params.append('foodCategoryIds', f)
  });
  // if(filterStatus !== undefined){
  //   params = params.append('filterStatus', filterStatus);
  // }

  if(foodRequestParams === undefined){
    foodRequestParams = FoodRequestParamsObj({});
  }

  if(foodRequestParams !== undefined){
    const reqMap = new Map(Object.entries(foodRequestParams));
    reqMap.forEach((value, key) => {
      params = params.append(key, value);
    });
  }

  console.log(params);
  return params;
}

export function FoodRequestParamsObj({
                                       isOpen = null,
                                       eaten = false,
                                       isAlerted = false,
                                       inTrash = false,
                                       deleted = false,
                                       foodStatus = EFoodStatusFilter.ANY,
                                     }: FoodRequestParamsModel) {
  const obj: FoodRequestParamsModel = {
    inTrash: inTrash,
    eaten: eaten,
    isAlerted: isAlerted,
    deleted: deleted,
    foodStatus: foodStatus
  }
  if(isOpen !== null){
    obj.isOpen = isOpen;
  }
  return obj;
}


