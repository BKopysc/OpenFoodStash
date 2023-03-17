import {Component, Input, OnInit} from '@angular/core';
import {DataPackageForOverall} from '../../../../../common/models/statistics/statistic.model';

@Component({
  selector: 'app-statistic-overall-tile',
  templateUrl: './statistic-overall-tile.component.html',
  styleUrls: ['./statistic-overall-tile.component.scss']
})
export class StatisticOverallTileComponent implements OnInit {

  @Input() data!: DataPackageForOverall;

  stateCheck: boolean = false;

  constructor() {}


  ngOnInit(): void {
  }

}
