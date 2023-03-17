import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FoodConsumeModel, FoodDetails} from '../../../../common/models/foods/foods.model';
import {Subscription} from 'rxjs';
import {FoodService} from '../../../../services/food/food.service';
import {FoodUnitTypeTrans} from '../../../../common/models/foods/food-unit-type.model';
import {CustomFormErrorHandling} from '../../../../common/utils/validators-func';

@Component({
  selector: 'app-eat-food-modal',
  templateUrl: './eat-food-modal.component.html',
  styleUrls: ['./eat-food-modal.component.scss']
})
export class EatFoodModalComponent implements OnInit, OnDestroy {

  eatForm!: FormGroup;
  setRemainingMode = false;

  leftCalculated = this.food.unitValue;
  subscription = new Subscription();
  formErrorHandling!: CustomFormErrorHandling;

  eatActionLoading = false;

  foodUnitTypeTrans = FoodUnitTypeTrans;

  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<EatFoodModalComponent>,
              private foodService: FoodService,
              @Inject(MAT_DIALOG_DATA) public food: FoodDetails) {

  }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

  ngOnInit(): void {
    this.dialogRef.updateSize('300px');
    this.eatForm = this.fb.group({
      eatAmount: [0, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/), Validators.min(0)]] //, Validators.pattern('/^[+-]?\\d+(\\.\\d+)?$/')
    });
    this.formErrorHandling = new CustomFormErrorHandling(this.eatForm);
  }

  onInputChange(){
    this.recalculateFromInput();
  }

  private recalculateFromInput() {
    const formValue = this.eatForm.controls['eatAmount'].value;
    const roundedValue = Math.round(formValue*100)/100;

    // if(this.setRemainingMode){
    //   if(roundedValue < 0){
    //     this.eatForm.controls['eatAmount'].patchValue(0);
    //     this.leftCalculated = this.food.unitValue;
    //   } else if (roundedValue > this.food.unitValue){
    //     this.eatForm.controls['eatAmount'].patchValue(this.food.unitValue);
    //     this.leftCalculated = 0; //will eat amount
    //   } else {
    //     this.eatForm.controls['eatAmount'].patchValue(roundedValue);
    //     this.leftCalculated = Math.round((this.food.unitValue - roundedValue)*100)/100;
    //   }
    // } else {
      if (roundedValue > this.food.unitValue) {
        this.eatForm.controls['eatAmount'].patchValue(this.food.unitValue);
        this.leftCalculated = 0;
      } else if(roundedValue < 0 ){
        this.eatForm.controls['eatAmount'].patchValue(0);
        this.leftCalculated = this.food.unitValue;
      } else {
        this.eatForm.controls['eatAmount'].patchValue(roundedValue);
        this.leftCalculated = Math.round((this.food.unitValue - roundedValue) * 100) / 100;
      }
    // }
  }


  onNoClick() {
    this.dialogRef.close();
  }

  onEatClick() {

    const formValue = this.eatForm.controls['eatAmount'].value;

    const consumeFoodData: FoodConsumeModel = {
      id: this.food.id,
      consumeAmount: this.setRemainingMode ? formValue : this.leftCalculated
    }


    this.eatActionLoading = true;
    this.subscription.add(this.foodService.consumeFood(this.food.id, consumeFoodData)
      .subscribe({
        next: value => {
          //this.food.unitValue = value.unitValue;
          this.eatActionLoading = false;
          this.dialogRef.close(value.unitValue);
        },
        error: err => this.eatActionLoading = false
      }))
    //TODO Subscription food service for eating
  }

  quickCalcBtn(amount: 'all' | 'half' | 'quarter' | 'zero') {
    let amountToCalc = 0;

    switch (amount){
      case 'all': {amountToCalc = this.food.unitValue;break;}
      case 'half': {amountToCalc = Math.round(this.food.unitValue/2); break;}
      case 'quarter': {amountToCalc = Math.round(this.food.unitValue/4); break;}
      case 'zero': {amountToCalc = 0; break;}
    }

    this.eatForm.controls['eatAmount'].patchValue(amountToCalc);
    this.recalculateFromInput();
  }

}
