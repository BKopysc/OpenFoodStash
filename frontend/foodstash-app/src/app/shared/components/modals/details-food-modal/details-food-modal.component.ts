import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FoodService} from '../../../../services/food/food.service';
import {FoodDetails} from '../../../../common/models/foods/foods.model';
import {Subscription} from 'rxjs';
import {FoodUnitTypeTrans} from '../../../../common/models/foods/food-unit-type.model';
import {FoodCategoryTransMap} from '../../../../common/models/foods/food-category.model';

@Component({
  selector: 'app-details-food-modal',
  templateUrl: './details-food-modal.component.html',
  styleUrls: ['./details-food-modal.component.scss']
})
export class DetailsFoodModalComponent implements OnInit {

  subscription = new Subscription();

  unitTypeTrans = FoodUnitTypeTrans;
  foodCategoryTrans = FoodCategoryTransMap;

  constructor(public dialogRef: MatDialogRef<DetailsFoodModalComponent>,
              private foodService: FoodService,
              @Inject(MAT_DIALOG_DATA) public food: FoodDetails) {

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
