import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FoodService} from '../../../../services/food/food.service';
import {FoodDetails} from '../../../../common/models/foods/foods.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-move-to-trash-food-modal',
  templateUrl: './move-to-trash-food-modal.component.html',
  styleUrls: ['./move-to-trash-food-modal.component.scss']
})
export class MoveToTrashFoodModalComponent implements OnInit {

  subscription = new Subscription();
  deleteLoading: boolean = false;

  throwOutMode = true;
  deleteMode = false;

  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<MoveToTrashFoodModalComponent>,
              private foodService: FoodService,
              @Inject(MAT_DIALOG_DATA) public food: FoodDetails) {

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onThrowOutClick() {
    this.deleteLoading = true;
    this.subscription.add(
      this.foodService.moveFoodToTrash(this.food.id).subscribe({
        next: value => {
          this.deleteLoading = false;
          this.dialogRef.close(true);
        }, error: err => {
          this.deleteLoading = false;
        }}));
  }

  onDeleteClick() {
    this.deleteLoading = true;
    this.subscription.add(
      this.foodService.deleteFood(this.food.id).subscribe({
        next: value => {
          this.deleteLoading = false;
          this.dialogRef.close(true);
        }, error: err => {
          this.deleteLoading = false;
        }}));
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onDeleteCheckChange() {
    this.throwOutMode = !this.deleteMode;
  }

  onThrowCheckChange() {
    this.deleteMode = !this.throwOutMode;
  }
}
