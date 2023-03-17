import {
  StatisticSummaryContent,
  StatisticSummaryTip,
  StatisticSummaryWithValue
} from '../models/statistics/statistic-summary.model';
import {EStatisticFoodAction, EStatisticTipOpinion} from '../models/statistics/statistic.model';
import {TransMapUtil} from './trans-map-util';
import {StatisticFoodActionTrans} from '../models/statistics/statistic-generated-trans.model';
import {FoodCategoryTransMap} from '../models/foods/food-category.model';

export class StatisticSummaryUtil {

  private statisticFoodActionTrans = new TransMapUtil(StatisticFoodActionTrans);
  private foodCategoryTrans = new TransMapUtil(FoodCategoryTransMap);

  getNumSummary(numData: Record<EStatisticFoodAction, number> | null, title: string): StatisticSummaryContent | null{

    if(numData == null){
      return null
    }

    const finalArr: StatisticSummaryWithValue[] = [];

    for (const key in numData) {
      const transKey = this.statisticFoodActionTrans.getTranslated(key);
      finalArr.push({transLabel: transKey, value: (numData as any)[key]})
    }

    return {
      transTitle: title,
      data: finalArr
    }
  }

  getSummaryTip(tipOpinion: EStatisticTipOpinion): StatisticSummaryTip {

    let emoji = '';
    let transText = '';
    let transInfo = '';

    switch (tipOpinion){
      case EStatisticTipOpinion.BAD:
        emoji = '😞';
        transText = 'statisticGeneratedContent.summaryTip.bad.title';
        transInfo = 'statisticGeneratedContent.summaryTip.bad.info'
        break;
      case EStatisticTipOpinion.GOOD:
        emoji = '🥳';
        transText = 'statisticGeneratedContent.summaryTip.good.title';
        transInfo = 'statisticGeneratedContent.summaryTip.good.info'
        break;
      case EStatisticTipOpinion.NEUTRAL:
        emoji = '😐';
        transText = 'statisticGeneratedContent.summaryTip.neutral.title';
        transInfo = 'statisticGeneratedContent.summaryTip.neutral.info'
        break;
      case EStatisticTipOpinion.NEUTRAL_ZERO:
        emoji = '😶'
        transText = 'statisticGeneratedContent.summaryTip.neutralZero.title';
        transInfo = 'statisticGeneratedContent.summaryTip.neutralZero.info'
    }
    return {
      emoji: emoji,
      transTitle: transText,
      transInfo: transInfo
    }
  }

  getCategorySummary(catData: Record<string, number> | null, title: string): StatisticSummaryContent | null{

    if(catData == null){
      return null
    }

    const tempArr: StatisticSummaryWithValue[] = [];
    for (const key in catData) {
      const transKey = this.foodCategoryTrans.getTranslated(key);
      tempArr.push({transLabel: transKey, value: (catData as any)[key]});
    }

    console.log(tempArr);

    return {
      transTitle: title,
      data: tempArr
    }
  }

}
