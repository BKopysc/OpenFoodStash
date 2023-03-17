
interface StatisticSummaryBase{
  transTitle: string,
}

export interface StatisticSummaryWithValue{
  transLabel: string,
  value: number
}

export interface StatisticSummaryContent extends StatisticSummaryBase{
  data: StatisticSummaryWithValue[];
}

// export interface StatisticSummaryNumContent extends StatisticSummaryBase{
//   value: number
// }

export interface StatisticSummaryTip extends StatisticSummaryBase{
  emoji: string,
  transInfo: string
}
