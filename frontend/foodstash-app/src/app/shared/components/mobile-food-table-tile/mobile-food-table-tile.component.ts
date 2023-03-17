import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  EFoodTableMobileAction,
  FoodTableMobileButtonEmitters,
  FoodTableMobileButtons
} from '../../../common/models/foods/foods-table.model';

@Component({
  selector: 'app-mobile-food-table-tile',
  templateUrl: './mobile-food-table-tile.component.html',
  styleUrls: ['./mobile-food-table-tile.component.scss']
})
export class MobileFoodTableTileComponent implements OnInit {

  @Input() nameValue: string ='';
  @Input() categoryTrans: string = '';
  @Input() value: number = 0;
  @Input() foodId: number = 0;
  @Input() valueTypeTrans: string = '';
  @Input() dateValue!: Date;
  @Input() dateTrans: string = '';
  @Input() actionsButtons: FoodTableMobileButtons[] = [];
  @Input() isWarning = false;
  @Output() emitButtonAction = new EventEmitter<FoodTableMobileButtonEmitters>();

  buttonsColors: string[] = [];
  constructor() { }

  ngOnInit(): void {
    this.getButtonsColors()
  }

  emitButtonClick(foodId: number, enumAction: EFoodTableMobileAction) {
    this.emitButtonAction.emit({foodId: foodId, enumAction: enumAction});
  }

  getButtonsColors(){
    const mainName= 'color--';
    this.buttonsColors = [
      mainName+'eat', mainName+'delete', mainName+'info', mainName+'edit'
    ];
  }
}
