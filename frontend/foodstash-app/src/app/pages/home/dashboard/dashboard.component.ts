import { Component, OnInit } from '@angular/core';
import {map, Subscription} from 'rxjs';
import {DashboardService} from '../../../services/dashboard/dashboard.service';
import {DashboardSimple} from '../../../common/models/dashboard/dashboard.model';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {DataPackageForOverall} from '../../../common/models/statistics/statistic.model';
import {APP_ROUTES} from '../../../core/routes.table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  subscription = new Subscription();
  dashboardSimple!: DashboardSimple;

  dataPackages: DataPackageForOverall[] = [];
  expectedDataNum: number[] = [0,1,2,3];

  dashboardLoading = true;

  stashLink = APP_ROUTES.stashes;
  addStash = APP_ROUTES.newStash;

  constructor(private dashboardService: DashboardService,
              private breakpointObs: BreakpointObserver) { }

dashboardGridOptions = this.breakpointObs.observe(Breakpoints.Handset).pipe(
  map(({matches}) => {
    if (matches) {
      return {
        columns: 2,
        colspan: 1,
        rowspan: 1,
      }
    }
    return {
      columns: 4,
      colspan: 1,
      rowspan: 1,
    }
  }));

  ngOnInit(): void {
    this.getSimpleDashboard()
  }

  createDataPackages(){
    this.dataPackages = [
      {transLabel: 'dashboard.numOfStorages', value: this.dashboardSimple.numOfStorages},
      {transLabel: 'dashboard.numOfStashes', value: this.dashboardSimple.numOfStashes},
      {transLabel: 'dashboard.numOfAlerts', value: this.dashboardSimple.numOfAlerts},
      {transLabel: 'dashboard.numOfActiveFood', value: this.dashboardSimple.numOfActiveFood},
    ];
  }

  getSimpleDashboard(){
    this.subscription.add(this.dashboardService.getSimpleDashboard()
      .subscribe({
        next: value => {
          this.dashboardSimple = value;
          this.createDataPackages();
          this.dashboardLoading = false;
        } , error: err => {
        }
      }));

  }

}
