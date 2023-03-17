import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FoodService} from '../../../../services/food/food.service';
import {FoodDetails} from '../../../../common/models/foods/foods.model';

@Component({
  selector: 'app-recover-food-modal',
  templateUrl: './recover-food-modal.component.html',
  styleUrls: ['./recover-food-modal.component.scss']
})
export class RecoverFoodModalComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  recoverActionLoading = false;

  constructor(public dialogRef: MatDialogRef<RecoverFoodModalComponent>,
              private foodService: FoodService,
              @Inject(MAT_DIALOG_DATA) public food: FoodDetails)
  {

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRecoverClicked(){
    this.recoverActionLoading = true;
    this.subscription.add(this.foodService.recoverFood(this.food.id)
      .subscribe({
        next: value => {
          this.recoverActionLoading = false
          this.dialogRef.close(this.food);
        },
        error: err => this.recoverActionLoading = false
      }));
  }

  onCancelClicked() {
    this.dialogRef.close(null);
  }
}
