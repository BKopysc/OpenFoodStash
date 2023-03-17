import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {map, Observable, ReplaySubject, shareReplay, Subject, Subscription, take, takeUntil} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import {
requiredIfValidator
} from '../../../common/utils/custom-validators';
import {FoodCreateModel, FoodFormModel} from '../../../common/models/foods/foods.model';
import {
  EFoodUnitType,
  FoodUnitType,
  FoodUnitTypeArr,
  FoodUnitTypeTrans
} from '../../../common/models/foods/food-unit-type.model';
import {MatSelect} from '@angular/material/select';
import {TranslateService} from '@ngx-translate/core';
import {verifyRouteParam} from '../../../common/utils/checkRouteParams';
import {ActivatedRoute, Router} from '@angular/router';
import {
  StorageDetails,
  StorageStashDetails,
  StorageTrans,
  StorageTransArr
} from '../../../common/models/storages/storage.model';
import {StorageService} from '../../../services/storage/storage.service';
import {FoodCategoryService} from '../../../services/food-category/food-category.service';
import {FoodCategoryDetails, FoodCategoryTransMap} from '../../../common/models/foods/food-category.model';
import {MatButton} from '@angular/material/button';
import {TransMapUtil} from '../../../common/utils/trans-map-util';
import {CustomFormErrorHandling} from '../../../common/utils/validators-func';
import {FoodService} from '../../../services/food/food.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-add-food-page',
  templateUrl: './add-food-page.component.html',
  styleUrls: ['./add-food-page.component.scss']
})
export class AddFoodPageComponent implements OnInit, AfterViewInit, OnDestroy {

  categories$: Observable<FoodCategoryDetails[]>;

  foodForm: FormGroup;
  addedFoods: FoodFormModel[] = [];

  //for UnitTypeSearchFilter
  unitTypesTrans = FoodUnitTypeTrans;
  protected unitTypes: FoodUnitType[] = FoodUnitTypeArr.filter(f => f.trans !== undefined);
  unitTypeFilterCtrl: FormControl = new FormControl<any>(null);
  filteredUnitTypes: ReplaySubject<FoodUnitType[]> = new ReplaySubject<FoodUnitType[]>(1); //zastapic units
  protected _onDestroy = new Subject<void>();

  minDate: Date;

  showExpirationDate: boolean = true;
  expirationDateFromPast: boolean = false;
  showFreshScore: boolean = false;

  availableStorages: StorageStashDetails[] = [];
  storageTrans = StorageTrans;

  storageId: number = -1;
  stashId: number = -1;

  selectedStorage?: StorageStashDetails;

  isFromStorageRoute = false;
  isFromStashRoute = false;

  initLoading = true;
  sendingLoading = false;

  subscription = new Subscription();
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  selectedFood: FoodFormModel[] = [];
  foodCategoryTrans = new TransMapUtil(FoodCategoryTransMap);
  formErrorHandling: CustomFormErrorHandling;

  backURL = location.pathname.substring(0, location.pathname.lastIndexOf('/'));

  @ViewChild('singleSelect', {static: true}) singleSelect!: MatSelect;
  @ViewChild('form_el', {static: true}) formDirective!: NgForm;


  //TODO naprawic resetowanie formularza!

  constructor(private breakpointObserver: BreakpointObserver,
              private fb: FormBuilder,
              private translateService: TranslateService,
              private route: ActivatedRoute,
              private storageService: StorageService,
              private foodCategoryService: FoodCategoryService,
              private router: Router,
              private foodService: FoodService) {

    const storageRouteId = this.route.snapshot.paramMap.get('storageId');
    const stashRouteId = this.route.snapshot.paramMap.get('stashId');

    if (storageRouteId !== null) {
      if (verifyRouteParam(storageRouteId)) {
        this.storageId = parseInt(storageRouteId);
        this.isFromStorageRoute = true;
      }
    }

    if (stashRouteId !== null) {
      if (verifyRouteParam(stashRouteId)) {
        this.stashId = parseInt(stashRouteId);
        this.isFromStashRoute = true;
      }
    }

    if (this.isFromStorageRoute) {
      this.subscription.add(
        this.storageService.getStorageWithStashName(this.storageId)
          .subscribe({
            next: value => {
              this.availableStorages.push(value);
              this.selectedStorage = value;
              this.initLoading = false;
            },
            error: err => {

            }
          }));

    }

    this.categories$ = this.foodCategoryService.getFoodCategories();

    this.foodForm = fb.group({
      storageId: [{
        value: this.storageId > 0 ? this.storageId : null,
        disabled: this.isFromStorageRoute,
      }, [Validators.required]],
      // storageId: [this.storageId > 0 ? this.storageId : null, [Validators.required]],
      name: [null, [Validators.required]],
      unitType: ['ML', [Validators.required]],
      initialUnitValue: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      expirationDate: [null, [requiredIfValidator(() => !this.foodForm.get('autoPredict')?.value)]],
      category: [null, [Validators.required]],
      autoPredict: [false],
      isEaten: [false],
      isOpen: [false],
      freshScore: [null, [requiredIfValidator(() => this.foodForm.get('autoPredict')?.value)]]
    });

    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

    this.formErrorHandling = new CustomFormErrorHandling(this.foodForm);
    this.translateUnitTypesOnInit();

  }

  private translateUnitTypesOnInit() {
    this.unitTypes.forEach(ut => {
      const trans = this.translateService.instant(ut.trans);
      ut.trans = trans;
    })
  }

  ngOnInit(): void {

    this.filteredUnitTypes.next(this.unitTypes.slice());

    this.unitTypeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUnitTypes();
      })

  }


  protected setInitialValue() {
    this.filteredUnitTypes
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: FoodUnitType, b: FoodUnitType) => a && b && a.name === b.name;
      });
  }

  ngAfterViewInit() {
    //this.setInitialValue();
  }


  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onAutoPredictClick() {
    this.showExpirationDate = !this.showExpirationDate;
    this.showFreshScore = !this.showFreshScore

    this.foodForm.get('expirationDate')?.updateValueAndValidity();
    this.foodForm.get('freshScore')?.updateValueAndValidity();
  }

  onAddMore() {

    if (this.foodForm.invalid) {
      console.error("form invalid");
      console.log(this.foodForm);
      this.foodForm.markAllAsTouched();
      return;
    }

    const formVal = this.foodForm.getRawValue() as FoodFormModel;
    formVal.storageName = this.availableStorages.find(o => o.id === formVal.storageId)!.name;

    if (formVal) {
      if (this.selectedFood.length > 0) {
        this.selectedFood = [];
      }
      this.addedFoods.push(formVal);
      this.clearForm();
    }
  }

  private clearForm() {

    const lastStorage = this.foodForm.get('storageId')?.value;
    this.showExpirationDate = true;
    this.showFreshScore = false;

    this.foodForm.reset();

    console.log(this.foodForm);

    Object.keys(this.foodForm.controls)
      .forEach(key => {
        //this.foodForm.get(key)?.setErrors(null);
      }
      );

    this.foodForm.get('storageId')?.setValue(lastStorage);
    this.foodForm.get('unitType')?.setValue('ML');

    this.foodForm.get('expirationDate')?.updateValueAndValidity();
    this.foodForm.get('freshScore')?.updateValueAndValidity();
  }

  protected filterUnitTypes() {
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

  onStorageSelect(event: any) {
    const selectedVal = event.value;
    this.selectedStorage = this.availableStorages.find(s => s.id === selectedVal);
  }

  getStorageType(storageType: string): string {
    const res = this.storageTrans.get(storageType);
    if (!res) {
      return '';
    } else {
      return res;
    }
  }

  scrollDown(el: HTMLDivElement) {
    el.scrollIntoView();
  }

  deleteFoodFromList(food: FoodFormModel) {
    const index = this.addedFoods.indexOf(food);
    if (index > -1) {
      this.addedFoods.splice(index, 1);
      if (this.selectedFood.length > 0) {
        this.clearForm();
      }
    }
  }

  selectedFoodChange(event: any) {
    console.log(event);
    if (this.selectedFood !== undefined && this.selectedFood[0]) {
      this.loadDataToForm(this.selectedFood[0]);
    }

  }

  private loadDataToForm(foodModel: FoodFormModel) {
    console.log(foodModel.name);
    console.log(foodModel);
    this.foodForm.patchValue({
      storageId: foodModel.storageId,
      name: foodModel.name,
      unitType: foodModel.unitType,
      initialUnitValue: foodModel.initialUnitValue,
      expirationDate: foodModel.expirationDate,
      category: foodModel.category,
      autoPredict: foodModel.autoPredict,
      ieEaten: foodModel.isEaten,
      isOpen: foodModel.isOpen,
      freshScore: foodModel.freshScore
    });

    if(foodModel.freshScore === null){
      this.showExpirationDate = true;
      this.showFreshScore = false;
    } else {
      this.showExpirationDate = false;
      this.showFreshScore = true;
    }

  }

  onUpdateFood() {
    const formVal = this.foodForm.getRawValue() as FoodFormModel;
    formVal.storageName = this.availableStorages.find(o => o.id === formVal.storageId)!.name;

    if(this.showFreshScore && formVal.freshScore !== null){
      formVal.expirationDate = null;
    } else {
      formVal.freshScore = null;
    }

    if (this.selectedFood.length > 0) {
      const selected = this.selectedFood[0];
      const index = this.addedFoods.indexOf(selected);
      if (index > -1) {
        this.addedFoods[index] = formVal;
        this.selectedFood = [];
      }
      this.clearForm();
    }
  }

  onCancelUpdateFood() {
    if (this.selectedFood.length > 0) {
      this.selectedFood = [];
      this.clearForm();
    }
  }

  saveFoodList() {
    console.log(this.addedFoods);

    if(this.addedFoods.length > 0){

      this.sendingLoading = true;

      const dataToSend: FoodCreateModel[] = this.addedFoods.map(
        food => {
          const model: FoodCreateModel = {
            categoryId: food.category,
            expirationDate: food.expirationDate,
            name: food.name,
            unitType: food.unitType,
            freshScore: food.freshScore,
            isOpen: food.isOpen,
            initialUnitValue: food.initialUnitValue,
            isEaten: food.isEaten,
            storageId: food.storageId
          }
          return model;
        }
      );

      this.subscription.add(this.foodService.addFoods(dataToSend)
        .subscribe({
            next: value => {
              this.sendingLoading = false;
              this.router.navigate([this.backURL]);
            },
            error: err => {this.sendingLoading = false}
          }));

    }
  }

  onExpirationDateChange() {
    const selectedDate = new Date(this.foodForm.get('expirationDate')?.value);
    if(selectedDate < new Date()){
      this.expirationDateFromPast = true;
    } else {
      this.expirationDateFromPast = false;
    }
  }
}
