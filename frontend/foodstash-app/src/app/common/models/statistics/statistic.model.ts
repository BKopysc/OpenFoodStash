export interface StatisticGenerateModel {
  startDate: Date,
  endDate: Date
}


export interface StatisticDateRangeModel {
  name: string,
  trans: string,
  startDate?: Date,
  endDate?: Date
}

export interface StorageStatisticModel{
  id: number,
  startDate: Date,
  endDate: Date,
  generatedData: StorageStatisticGeneratedData | null
}

export interface SimpleStorageStatisticModel{
  id: number,
  startDate: Date,
  endDate: Date,
  storageName: string
}

export enum EStatisticFoodAction{
  ADDED="ADDED",
  DELETED="DELETED",
  WASTED="WASTED",
  EATEN="EATEN",
  IN_TRASH="IN_TRASH",
  EATEN_AFTER="EATEN_AFTER"
}

export enum EStatisticTipOpinion{
  "GOOD"="GOOD",
  "NEUTRAL"="NEUTRAL",
  "NEUTRAL_ZERO"="NEUTRAL_ZERO",
  "BAD"="BAD"
}

export interface StorageStatisticGeneratedData{
  name?: string,
  startDate?: Date,
  endDate?: Date,
  storageName: string,
  foodActionsStats: Record<EStatisticFoodAction, number>
  numberOfAddedByCategory: Map<string, number> | null,
  numberOfMovedToTrashByCategory: Map<string, number> | null,
  numberOfEatenByCategory: Map<string, number> | null,
  numberOfWastedByCategory: Map<string, number> | null,
  numberOfEatenAfterExpiredByCategory: Map<string, number> | null,

  mostFreqAddedCategory: Record<string, number> | null,
  mostFreqMoveToTrashCategory: Record<string, number> | null,
  mostFreqEatenCategory: Record<string, number> | null,
  mostFreqWastedCategory: Record<string, number> | null,
  mostFreqEatenAfterExpiredCategory: Record<string, number> | null,
  mostFreqFoodActions: Record<EStatisticFoodAction, number> | null,

  tipOpinion: EStatisticTipOpinion
}

export interface DataForCharts{
  label: string,
  value: number,
}

export interface DataForActionsChart{
  title: string,
  data: Record<EStatisticFoodAction, number>
}

export interface StorageStatisticInfoModel{
  allActiveFood: number,
  allEatenFood: number,
  allAlertedFood: number,
  allAddedFood: number,
  allInTrash: number,
  allDeleted: number
}

export interface DataPackageForCharts{
  actionType: string,
  data: Map<string, number> | null
}

export interface DataPackageForOverall{
  transLabel: string,
  value: number
}

export const StatisticDateRangesTrans: StatisticDateRangeModel[] = [
  {name: 'week', trans: 'statisticTab.dateRange.week'},
  {name: 'month', trans: 'statisticTab.dateRange.month'},
  {name: 'custom', trans: 'statisticTab.dateRange.custom'},
];

