import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  DataForActionsChart,
  DataForCharts,
  DataPackageForCharts, EStatisticFoodAction
} from '../../../../../common/models/statistics/statistic.model';
import {ChartDataset, ChartOptions} from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import formatters from 'chart.js/dist/core/core.ticks';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {StatisticFoodActionTrans} from '../../../../../common/models/statistics/statistic-generated-trans.model';
import {TransMapUtil} from '../../../../../common/utils/trans-map-util';
import {FoodCategoryTransMap} from '../../../../../common/models/foods/food-category.model';

@Component({
  selector: 'app-statistic-chart-tile',
  templateUrl: './statistic-chart-tile.component.html',
  styleUrls: ['./statistic-chart-tile.component.scss']
})
export class StatisticChartTileComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() dataForNumChart!: DataForActionsChart;
  @Input() dataForCatChart!: DataPackageForCharts;
  @Input() chartTitle = '';
  @Input() chartType: 'pie' | 'bar' = 'pie';
  @Input() isHandset: boolean = false;
  @Input() eventChart!: Observable<boolean>;

  private eventSub = new Subscription();

  public dynWidth = 380;
  public dynHeight = 400;

  // Pie
  public chartOptions: ChartOptions<'bar' | 'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {position: "bottom", display: true},
      datalabels: {
        display: true,
        formatter: (value) => {
          return value > 0 ? value : null;
        },
        color: '#070707',
        font: {weight: 'bold'}
      },
      title: {
        display: true,
        text: 'test'
      },
    },
  };
  public chartLabels: string[][] = [];
  public chartDatasets: [{ data: number[] }] = [{
    data: [],
  }];
  public chartLegend = true;
  public chartPlugins = [DatalabelsPlugin];

  statisticFoodActionTrans = new TransMapUtil(StatisticFoodActionTrans);
  foodCategoryTrans = new TransMapUtil(FoodCategoryTransMap);

  constructor(private translateService: TranslateService) {
  }

  ngAfterViewInit() {
    //this.chartOptions = { ...this.chartOptions };
  }

  ngOnInit(): void {
    this.initAllChart();
  }

  private translateActionLabels(keys: Array<EStatisticFoodAction>) {
    this.translateService.get('foodActions').subscribe((transValue) => {
      const transArr: string[][] = [];
      keys.forEach(value => {
        const text = this.statisticFoodActionTrans.getTranslated(value);
        //cut foodActions
        const keyForTrans = text.split('.')[1];
        transArr.push(transValue[keyForTrans]);
      });
      this.chartLabels = transArr;
    })
  }

  private translateCategoryLabel(keys: Array<string>) {
    this.translateService.get('foodCategory.label').subscribe((transValue) => {
      const transArr: string[][] = [];
      keys.forEach(value => {
        const text = this.foodCategoryTrans.getTranslated(value);
        const keyForTrans = text.split('.')[2];
        transArr.push(transValue[keyForTrans]);
      })
      this.chartLabels = transArr;
    });
  }

  private fixForBarChart() {
    this.chartLegend = false;
    this.chartOptions.scales = {y: {ticks: {precision: 0}}}
  }

  private fixForPieChart() {
    this.chartLegend = true;
    this.chartOptions.scales = {}
  }

  ngOnChanges(changes: SimpleChanges) {

    console.log(changes);

    if (changes['chartType']) {
      if (changes['chartType'].currentValue == 'pie') {
        this.fixForPieChart();
      } else {
        this.fixForBarChart()
      }
    }
    if (changes['isHandset']) {
      this.changeWidth();
    }

    if(changes['dataForNumChart']){
      if(!changes['dataForNumChart'].firstChange && changes['dataForNumChart'].currentValue !== changes['dataForNumChart'].previousValue) {
        console.log(changes['dataForNumChart'].currentValue);
        this.dataForNumChart = changes['dataForNumChart'].currentValue;
        this.resetChart();
        this.initAllChart();
      }
    }

    this.chartOptions = {...this.chartOptions};

  }

  private prepareNumChart(){
    if(this.dataForNumChart == undefined){
      return;
    }
    //this.chartLabels = Array.from(Object.keys(this.dataForNumChart.data)).map(value => [value]);
    this.translateActionLabels(Object.keys(this.dataForNumChart.data) as EStatisticFoodAction[]);
    Array.from(Object.values(this.dataForNumChart.data))
      .forEach((value, index) => {
        this.chartDatasets[0].data.push(value)
      });
    this.chartOptions.plugins!.title!.text = this.chartTitle;
  }

  private resetChart(){
    this.chartLabels = [];
    this.chartDatasets[0].data = [];
  }

  private prepareForCatChart(){
    if(this.dataForCatChart == undefined){
      return;
    }
    //this.chartLabels = Array.from(this.dataForCatChart.data!.keys()).map(value => [value]);
    this.translateCategoryLabel(Array.from(this.dataForCatChart.data!.keys()));
    Array.from(this.dataForCatChart.data!.values())
      .forEach((value, index) => {
        this.chartDatasets[0].data.push(value)
      });
    this.chartOptions.plugins!.title!.text = this.chartTitle;
  }

  private initAllChart(){
    if (this.dataForCatChart !== undefined) {
      this.prepareForCatChart();
    } else if (this.dataForNumChart !== undefined) {
      this.prepareNumChart();
    }

    if (this.chartType == 'bar') {
      this.fixForBarChart();
    }

    this.changeWidth();
    this.chartOptions = {...this.chartOptions};

    if (this.eventChart !== undefined) {
      this.eventSub = this.eventChart.subscribe((value) => this.changeChartType(value));
    }
  }

  changeWidth() {
    if (this.isHandset) {
      this.dynWidth = 300;
      this.dynHeight = 350;
    } else {
      this.dynWidth = 450;
      this.dynHeight = 400;
    }
  }

  changeChartType(isPieChart: boolean) {
    if (isPieChart) {
      this.chartType = 'pie';
      this.fixForPieChart();
    } else {
      this.chartType = 'bar';
      this.fixForBarChart();
    }
  }

  ngOnDestroy(): void {
    this.eventSub.unsubscribe();
  }


}
