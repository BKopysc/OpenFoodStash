import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  DataForActionsChart,
  DataForCharts, DataPackageForCharts, DataPackageForOverall, EStatisticFoodAction,
  StatisticDateRangeModel,
  StatisticDateRangesTrans,
  StatisticGenerateModel, StorageStatisticInfoModel, StorageStatisticModel
} from '../../../common/models/statistics/statistic.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomFormErrorHandling} from '../../../common/utils/validators-func';
import {map, Subscription} from 'rxjs';
import {StatisticsService} from '../../../services/statistics/statistics.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {
  StatisticSummaryContent, StatisticSummaryTip
} from '../../../common/models/statistics/statistic-summary.model';
import {StatisticSummaryUtil} from '../../../common/utils/statistic-summary-util';
import {MatDialog} from '@angular/material/dialog';
import {
  LastStatisticsListModalComponent
} from './modal/last-statistics-list-modal/last-statistics-list-modal.component';
import {AlertsService} from '../../../services/alerts/alerts.service';

@Component({
  selector: 'app-statistics-tab',
  templateUrl: './statistics-tab.component.html',
  styleUrls: ['./statistics-tab.component.scss']
})
export class StatisticsTabComponent implements OnInit {

  @Input() storageId!: number;
  @Output() onGenerateAlerts = new EventEmitter<number>();

  radioDates: StatisticDateRangeModel[] = StatisticDateRangesTrans;
  selectedDateRange: StatisticDateRangeModel = this.radioDates[0];
  storageStatisticModel!: StorageStatisticModel;
  storageStatisticInfo!: StorageStatisticInfoModel | null;

  preparedDataForNumChart: DataForActionsChart | undefined;
  preparedDataForCatChart: DataPackageForCharts[] = [];
  preparedDataForOverall: DataPackageForOverall[] = [];
  chartType: 'pie' | 'bar' = 'pie';

  summaryCatContent: Array<StatisticSummaryContent | null> = [];
  summaryNumContent!: StatisticSummaryContent | null;
  summaryTipObj!: StatisticSummaryTip;

  triedToGenerate: boolean = false;

  rangeDateForm!: FormGroup;
  minDate: Date;
  maxDate: Date;
  currentDate: Date;

  formErrorHandling!: CustomFormErrorHandling;
  subscription = new Subscription();

  loadingGenerating = false;
  loadingOverall = false;
  loadingForceCheck = false;

  statisticSummaryUtil = new StatisticSummaryUtil();
  // customDateRange!: {
  //   startDate: Date,
  //   endDate: Date
  // };

  constructor(private fb: FormBuilder,
              private statisticsService: StatisticsService,
              private breakpointObs: BreakpointObserver,
              private alertService: AlertsService,
              private dialog: MatDialog) {
    this.currentDate = new Date();
    this.minDate = new Date(this.currentDate.getFullYear() - 1,
      this.currentDate.getMonth() - 5, 1);
    this.maxDate = this.currentDate;
  }

  ngOnInit(): void {
    this.rangeDateForm = this.fb.group({
      start: [null, [Validators.required, Validators.min(this.minDate.getDate())]],
      end: [null, [Validators.required, Validators.max(this.maxDate.getDate())]]
    });
    this.formErrorHandling = new CustomFormErrorHandling(this.rangeDateForm);

    this.getOverallData();

  }

  overallGridOptions = this.breakpointObs.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return {
          columns: 2,
          colspan: 1,
          rowspan: 1,
        }
      }
      return {
        columns: 6,
        colspan: 1,
        rowspan: 1,
      }
    }));

  chartGridOptions = this.breakpointObs.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return {
          columns: 1,
          colspan: 1,
          rowspan: 1,
          handset: true
        }
      }
      return {
        columns: 2,
        colspan: 1,
        rowspan: 1,
        handset: false
      }
    }));



   onShowLastStatsList(){
    const lastStatsListDialogRef = this.dialog.open(LastStatisticsListModalComponent, {
      data: this.storageId, disableClose: true
    });

    lastStatsListDialogRef.afterClosed().subscribe(result => {
      if(result == null){
        return;
      }
      console.log(result);
      this.loadLastStatistic(result);
    })

  }

  private createOverallInfo() {

    if (this.storageStatisticInfo === null) {
      return;
    }

    this.preparedDataForOverall.push(
      {transLabel: 'statisticTab.overallSection.current', value: this.storageStatisticInfo.allActiveFood},
      {transLabel: 'statisticTab.overallSection.alert', value: this.storageStatisticInfo.allAlertedFood},
      {transLabel: 'statisticTab.overallSection.added', value: this.storageStatisticInfo.allAddedFood},
      {transLabel: 'statisticTab.overallSection.eaten', value: this.storageStatisticInfo.allEatenFood},
      {transLabel: 'statisticTab.overallSection.inTrash', value: this.storageStatisticInfo.allInTrash},
      {transLabel: 'statisticTab.overallSection.deleted', value: this.storageStatisticInfo.allDeleted},
    )
  }

  private getOverallData() {
    this.loadingOverall = true;
    this.subscription.add(this.statisticsService.getOverallStatistic(this.storageId)
      .subscribe({
        next: value => {
          this.storageStatisticInfo = value;
          this.loadingOverall = false;
          this.createOverallInfo();
        },
        error: err => this.loadingOverall = false
      }));
  }

  getDateRange(): {
    startDate: Date,
    endDate: Date
  } {
    let startDate: Date = new Date();
    let endDate: Date = new Date();
    //endDate.setDate(startDate.getDate() - 1);

    switch (this.selectedDateRange.name) {
      case "week": {
        startDate.setDate(endDate.getDate() - 7);
        break;
      }
      case "month": {
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      }
      case "custom": {
        if (this.rangeDateForm.valid) {
          const startValue = this.rangeDateForm.controls['start'].value as Date;
          const endValue = this.rangeDateForm.controls['end'].value as Date;
          startDate.setTime(startValue.getTime());
          endDate.setTime(endValue.getTime());
          endDate.setHours(23,59,59,999);
        }
        break;
      }
    }

    return {
      startDate: startDate,
      endDate: endDate
    }
  }

  onGenerateStatistics(): void {
    if (this.selectedDateRange.name == "custom" && this.rangeDateForm.invalid) {
      this.rangeDateForm.markAllAsTouched();
      return;
    }

    if (this.storageId === undefined) {
      return;
    }

    const datesValues = this.getDateRange();

    const dataObj: StatisticGenerateModel = {
      startDate: datesValues.startDate,
      endDate: datesValues.endDate
    }

    this.loadingGenerating = true;
    this.subscription.add(
      this.statisticsService.generateAndGetStatistics(this.storageId, dataObj)
        .subscribe({
          next: value => {
            this.storageStatisticModel = value;
            this.prepareDataForCharts();
            this.loadingGenerating = false;
            this.scrollToChartsDiv();
            console.log(value);
          },
          error: err => {
            this.triedToGenerate = true;
          }
        }));
  }

  private scrollToChartsDiv() {
    const selector = 'main-charts-panel'
    const el = document.getElementById(selector);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
      return;
    }
    const observer = new MutationObserver(mutations => {
      mutations.forEach(value => {
        const nodes = Array.from(value.addedNodes);
        nodes.forEach(node => {
          if (node.contains(document.getElementById(selector))) {
            const el2 = document.getElementById(selector);
            if (el2) {
              el2.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
            observer.disconnect();
            return;
          }
        })
      });
    });
    observer.observe(document.documentElement, {childList: true, subtree: true});
  }

  prepareDataForCharts() {
    this.preparedDataForCatChart = [];
    this.preparedDataForNumChart = undefined;
    this.triedToGenerate = true;

    const generatedData = this.storageStatisticModel.generatedData;

    if (generatedData == null) {
      return;
    }

    this.preparedDataForNumChart = {
      title: 'statisticGeneratedContent.charts.foodActions',
      data: generatedData.foodActionsStats
    }

    console.log(generatedData.foodActionsStats);
    console.log(this.preparedDataForNumChart);

    this.preparedDataForCatChart.push(
      {actionType: 'statisticGeneratedContent.charts.added', data: generatedData.numberOfAddedByCategory},
      {actionType: 'statisticGeneratedContent.charts.eaten', data: generatedData.numberOfEatenByCategory},
      {actionType: 'statisticGeneratedContent.charts.wasted', data: generatedData.numberOfWastedByCategory},
      {actionType: 'statisticGeneratedContent.charts.eatenAfter', data: generatedData.numberOfEatenAfterExpiredByCategory},
      {actionType: 'statisticGeneratedContent.charts.movedToTrash', data: generatedData.numberOfMovedToTrashByCategory}
    );

    const tempArr = this.preparedDataForCatChart;
    this.preparedDataForCatChart = [];
    tempArr.forEach(v => {
      if (v.data !== null) {
        v.data = new Map(Object.entries(v.data));
        this.preparedDataForCatChart.push(v);
      }
    });

    this.createSummary();

  }

  loadLastStatistic(statisticId: number) {
    this.loadingGenerating = true;
    this.subscription.add(
      this.statisticsService.getOneStatistic(statisticId).subscribe(
        {
          next: value => {
            this.storageStatisticModel = value;
            this.prepareDataForCharts();
            this.loadingGenerating = false;
            this.scrollToChartsDiv();
          },
          error: err => this.loadingGenerating = false
        }));
  }

  private createSummary() {
    const genData = this.storageStatisticModel.generatedData;
    this.summaryNumContent = null;
    this.summaryCatContent = [];

    if (genData == null) {
      return;
    }

    this.summaryNumContent = this.statisticSummaryUtil.getNumSummary(
      genData.mostFreqFoodActions, 'statisticGeneratedContent.summary.mostFreqAction'
    );

    this.summaryCatContent.push(
      this.statisticSummaryUtil.getCategorySummary(genData.mostFreqAddedCategory, 'statisticGeneratedContent.summary.mostFreqAdded'),
      this.statisticSummaryUtil.getCategorySummary(genData.mostFreqWastedCategory, 'statisticGeneratedContent.summary.mostFreqWasted'),
      this.statisticSummaryUtil.getCategorySummary(genData.mostFreqEatenCategory, 'statisticGeneratedContent.summary.mostFreqEaten'),
      this.statisticSummaryUtil.getCategorySummary(genData.mostFreqMoveToTrashCategory, 'statisticGeneratedContent.summary.mostFreqTrash'),
      this.statisticSummaryUtil.getCategorySummary(genData.mostFreqEatenAfterExpiredCategory, 'statisticGeneratedContent.summary.mostFreqEatenAfter'),
    );

    this.summaryTipObj = this.statisticSummaryUtil.getSummaryTip(genData.tipOpinion);
  }

  chartToggleChange() {
    console.log(this.chartType);
  }

  onForceCheckAlerts() {
     this.loadingForceCheck = true;
    this.subscription.add(this.alertService.forceAndExecuteAlerts(this.storageId)
      .subscribe({
        next:value => {
          this.loadingForceCheck = false;
          this.onGenerateAlerts.emit(value.numberOfAlerts);
        },
        error: err => {
          this.loadingForceCheck = false;
        }}))
  }
}
