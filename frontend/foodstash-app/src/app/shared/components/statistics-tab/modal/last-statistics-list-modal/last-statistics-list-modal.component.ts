import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {StatisticsService} from '../../../../../services/statistics/statistics.service';
import {SimpleStorageStatisticModel} from '../../../../../common/models/statistics/statistic.model';

@Component({
  selector: 'app-last-statistics-list-modal',
  templateUrl: './last-statistics-list-modal.component.html',
  styleUrls: ['./last-statistics-list-modal.component.scss']
})
export class LastStatisticsListModalComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  statsList: SimpleStorageStatisticModel[] = [];
  listLoading = true;

  selectedStatistic: number[] = [];

  constructor( public dialogRef: MatDialogRef<LastStatisticsListModalComponent>,
               private statisticService: StatisticsService,
               @Inject(MAT_DIALOG_DATA) public storageId: number) {

  }

  ngOnInit(): void {
    this.subscription.add(
      this.statisticService.getLastStatisticsList(this.storageId).subscribe({
        next: value => {
          this.statsList = value;

          if(value.length > 0){
            this.selectedStatistic.push(this.statsList[0].id);
          }

          this.listLoading = false
        },
        error: err => {
          this.listLoading = false;
        }
      }));
  }

  onLoadClick() {

    console.log(this.selectedStatistic);

    if(this.selectedStatistic.length > 0){
      this.dialogRef.close(this.selectedStatistic[0]);
    } else {
      this.dialogRef.close(null);
    }
  }

  onNoClick() {
    this.dialogRef.close(null);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
