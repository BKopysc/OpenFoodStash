import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs';

@Component({
  selector: 'app-about-quick-offers',
  templateUrl: './about-quick-offers.component.html',
  styleUrls: ['./about-quick-offers.component.scss']
})
export class AboutQuickOffersComponent implements OnInit {

  preparedOffers: Array<{icon: string, info: string}> = [];
  preparedOffersIcons: string[] = [];

  constructor(private breakpointObs: BreakpointObserver) { }

  offersGridOptions = this.breakpointObs.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return {
          columns: 2,
          colspan: 1,
          rowspan: 1,
        }
      }
      return {
        columns: 3,
        colspan: 1,
        rowspan: 1,
      }
    }));

  ngOnInit(): void {
    this.createOffers(6);
  }

  createOffers(endOfferNum: number){
    const offer = 'about.quickOffers.offer';
    this.preparedOffersIcons = ['account_circle', 'lunch_dining', 'search', 'warning', 'groups', 'analytics'];

    for(let i = 1; i <= endOfferNum; i++){
      this.preparedOffers.push({
        icon: this.preparedOffersIcons[i-1],
        info: (offer+i.toString())
      });
    }
  }

}
