import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ReplaySubject, Subject, Subscription, takeUntil, zip} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FoodService} from '../../../../services/food/food.service';
import {FoodDetails, FoodEditModel} from '../../../../common/models/foods/foods.model';
import {requiredIfValidator} from '../../../../common/utils/custom-validators';
import {StashService} from '../../../../services/stash/stash.service';
import {FoodCategoryService} from '../../../../services/food-category/food-category.service';
import {StorageService} from '../../../../services/storage/storage.service';
import {StorageDetails, StorageStashDetails, StorageTrans} from '../../../../common/models/storages/storage.model';
import {FoodCategoryDetails, FoodCategoryTransMap} from '../../../../common/models/foods/food-category.model';
import {CustomFormErrorHandling} from '../../../../common/utils/validators-func';
import {FoodUnitType, FoodUnitTypeArr, FoodUnitTypeTrans} from '../../../../common/models/foods/food-unit-type.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-edit-food-modal',
  templateUrl: './edit-food-modal.component.html',
  styleUrls: ['./edit-food-modal.component.scss']
})
export class EditFoodModalComponent implements OnInit, OnDestroy {

  subscription = new Subscription();

  editActionLoading = false;
  loadingAvailable = false;
  loadingError = false;

  foodEditForm!: FormGroup;
  availableStorages: StorageStashDetails[] = [];
  availableCategories: FoodCategoryDetails[] = [];
  selectedStorage!: StorageStashDetails;

  minDate: Date;
  expirationDateFromPast: boolean = false;
  formErrorHandling!: CustomFormErrorHandling;

  foodCategoryTrans = FoodCategoryTransMap;

  //for UnitTypeSearchFilter
  unitTypesTrans = FoodUnitTypeTrans;
  protected unitTypes: FoodUnitType[] = FoodUnitTypeArr.filter(f => f.trans !== undefined);
  unitTypeFilterCtrl: FormControl = new FormControl<any>(null);
  filteredUnitTypes: ReplaySubject<FoodUnitType[]> = new ReplaySubject<FoodUnitType[]>(1); //zastapic units
  protected _onDestroy = new Subject<void>();


  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<EditFoodModalComponent>,
              private foodService: FoodService,
              private storageService: StorageService,
              private foodCategory: FoodCategoryService,
              private translateService: TranslateService,
              @Inject(MAT_DIALOG_DATA) public food: FoodDetails)
  {
    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  }

  ngOnInit(): void {
    this.loadingAvailable = true;
    this.subscription.add(zip([
      this.storageService.getOtherInStashStorages(this.food.storageId),
      this.foodCategory.getFoodCategories()
    ]).subscribe({
      next: value => {
        this.availableStorages = value[0];
        this.availableCategories = value[1];
        this.createForm();
        this.loadingAvailable = false;
        this.selectedStorage = this.availableStorages.find(s=>s.id === this.food.storageId)!;
      },
      error: err => {
        this.loadingAvailable = false;
        this.loadingError = false;
      }}
    ))

    console.log(this.unitTypes);

    this.filteredUnitTypes.next(this.unitTypes.slice());

    this.unitTypeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUnitTypes();
      });
  }

  getStorageType(storageType: string): string {
    const res = StorageTrans.get(storageType);
    if (!res) {
      return '';
    } else {
      return res;
    }
  }

  private createForm(){
    this.foodEditForm = this.fb.group({
      storageId:[ this.food.storageId, [Validators.required]],
      name: [this.food.name, [Validators.required]],
      unitType: [this.food.unitType , [Validators.required]],
      unitValue: [this.food.unitValue, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/),
        Validators.min(0)]],
      initialUnitValue: [this.food.initialUnitValue, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/),
        Validators.min(0)]],
      expirationDate: [this.food.expirationDate, [Validators.required]],
      categoryId: [this.food.foodCategoryDetailsDto.id, [Validators.required]],
      isOpen: [this.food.open],
    });

    this.formErrorHandling = new CustomFormErrorHandling(this.foodEditForm);
    this.translateUnitTypesOnInit();
  }

  private translateUnitTypesOnInit() {
    this.unitTypes.forEach(ut => {
      const trans = this.translateService.instant(ut.trans);
      ut.trans = trans;
    })
  }

  onExpirationDateChange() {
    const selectedDate = new Date(this.foodEditForm.get('expirationDate')?.value);
    if(selectedDate < new Date()){
      this.expirationDateFromPast = true;
    } else {
      this.expirationDateFromPast = false;
    }
  }
  protected filterUnitTypes(){
    if (!this.unitTypes) {
      return;
    }

    let search = this.unitTypeFilterCtrl.value;
    if (!search) {
      this.filteredUnitTypes.next(this.unitTypes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredUnitTypes.next(
      this.unitTypes.filter(unitType => unitType.trans.toLowerCase().startsWith(search))
    );
  }

  ngOnDestroy(): void {

  }

  onNoClick() {
    this.dialogRef.close(null);
  }

  onEditClick() {
    if(this.foodEditForm.invalid){
      return;
    }

    const formValues = this.foodEditForm.getRawValue();
    const foodBody: FoodEditModel = {
      id: this.food.id,
      name: formValues.name,
      expirationDate: formValues.expirationDate,
      initialUnitValue: formValues.initialUnitValue,
      unitValue: formValues.unitValue,
      unitType: formValues.unitType,
      isOpen: formValues.isOpen,
      categoryId: formValues.categoryId,
      storageId: formValues.storageId
    };

    //console.log(foodBody);

    this.editActionLoading = true;
    this.subscription.add(
      this.foodService.editFood(this.food.id, foodBody)
        .subscribe({
        next: value => {
          this.editActionLoading = false;
          this.dialogRef.close(value);
        }, error: err => {
          this.editActionLoading = false
          }}));
  }

  onStorageSelection() {
    this.selectedStorage = this.availableStorages.find(s=>s.id === this.foodEditForm.controls['storageId'].value)!;
  }

  onInitialValueChange() {
    let initValue = this.foodEditForm.controls['initialUnitValue'].value;
    const currentValue = this.foodEditForm.controls['unitValue'].value;

    if(initValue < 0){
      this.foodEditForm.controls['initialUnitValue'].patchValue(0);
    }

    if(initValue < currentValue){
      this.foodEditForm.controls['unitValue'].patchValue(initValue);
    }
  }


  onCurrentValueChange() {
    const initValue = this.foodEditForm.controls['initialUnitValue'].value;
    let currentValue = this.foodEditForm.controls['unitValue'].value;

    if(currentValue < 0){
      this.foodEditForm.controls['unitValue'].patchValue(0);
    }

    if(currentValue > initValue){
      this.foodEditForm.controls['initialUnitValue'].patchValue(currentValue);
    }
  }
}
