import {EStatisticFoodAction} from './statistic.model';


export const StatisticFoodActionTrans: Map<string, string>
  = new Map<string, string>([
  [EStatisticFoodAction.ADDED as string, 'foodActions.added'],
  [EStatisticFoodAction.EATEN as string, 'foodActions.eaten'],
  [EStatisticFoodAction.WASTED as string, 'foodActions.wasted'],
  [EStatisticFoodAction.DELETED as string, 'foodActions.deleted'],
  [EStatisticFoodAction.IN_TRASH as string, 'foodActions.inTrash'],
  [EStatisticFoodAction.EATEN_AFTER as string, 'foodActions.eatenAfter']
  ]);
