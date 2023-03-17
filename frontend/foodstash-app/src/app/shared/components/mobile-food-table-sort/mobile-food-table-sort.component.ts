import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FoodTableSorterElem, FoodTableSorterEmitter} from '../../../common/models/foods/foods-table.model';

@Component({
  selector: 'app-mobile-food-table-sort',
  templateUrl: './mobile-food-table-sort.component.html',
  styleUrls: ['./mobile-food-table-sort.component.scss']
})
export class MobileFoodTableSortComponent implements OnInit {

  @Input() sortingHeaders: FoodTableSorterElem[] = [];
  @Output() sortingEmitter = new EventEmitter<FoodTableSorterEmitter>();

  selectedValue: string = '';
  sortingDirection: 'asc' | 'desc' = 'asc';
  sortingIcon: 'arrow_upward' | 'arrow_downward' = 'arrow_upward'

  constructor() { }

  ngOnInit(): void {
    if(this.sortingHeaders.length > 0){
      this.selectedValue = this.sortingHeaders[this.sortingHeaders.length-1].value;
    }
  }

  onSelectedChange() {
    this.sortingEmitter.emit({
      value: this.selectedValue, direction: this.sortingDirection
    });
  }
  //
  // onDirectionClicked() {
  //   if(this.sortingDirection === 'asc'){
  //     this.sortingDirection = 'desc';
  //     this.sortingIcon = 'arrow_downward';
  //   } else {
  //     this.sortingDirection = 'asc';
  //     this.sortingIcon = 'arrow_upward';
  //   }
  // }

}
