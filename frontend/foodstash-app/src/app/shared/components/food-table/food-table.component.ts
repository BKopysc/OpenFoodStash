import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {EFoodStatus, EFoodStatusFilter, FoodDetails, FoodStatusFilter} from '../../../common/models/foods/foods.model';
import {SelectionModel} from '@angular/cdk/collections';
import {FoodService} from '../../../services/food/food.service';
import {map, merge, Observable, shareReplay, Subscription, tap} from 'rxjs';
import {FoodPageHttpParams, FoodRequestParamsObj} from '../../../common/utils/http-params-helper';
import {CustomPaginatorImpl} from '../custom-paginator/custom-paginator-impl';
import {EmptyPageAttrObj, PageAttrObj, PageSpringAttr} from '../../../common/models/spring-models/page.model';
import {MatSort} from '@angular/material/sort';
import {FoodUnitTypeTrans} from '../../../common/models/foods/food-unit-type.model';
import {APP_ROUTES} from '../../../core/routes.table';
import {Router} from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {FoodCategoryDetails, FoodCategoryTransMap} from '../../../common/models/foods/food-category.model';
import {MatOption} from '@angular/material/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {FoodCategoryService} from '../../../services/food-category/food-category.service';
import {MatDialog} from '@angular/material/dialog';
import {EatFoodModalComponent} from '../modals/eat-food-modal/eat-food-modal.component';
import {MoveToTrashFoodModalComponent} from '../modals/move-to-trash-food-modal/move-to-trash-food-modal.component';
import {DetailsFoodModalComponent} from '../modals/details-food-modal/details-food-modal.component';
import {EditFoodModalComponent} from '../modals/edit-food-modal/edit-food-modal.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {
  EFoodTableMobileAction,
  FoodsUpdateEmitterModel,
  FoodTableMobileButtonEmitters,
  FoodTableMobileButtons, FoodTableSorterElem, FoodTableSorterEmitter
} from '../../../common/models/foods/foods-table.model';

@Component({
  selector: 'app-food-table',
  templateUrl: './food-table.component.html',
  styleUrls: ['./food-table.component.scss'],
  providers: [
    {provide: MAT_PAGINATOR_DEFAULT_OPTIONS, useValue: {formFieldAppearance: 'outline'}},
    {provide: MatPaginatorIntl, useClass: CustomPaginatorImpl}
  ]
})
export class FoodTableComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() storageId!: number;
  @Output() tableContentChange = new EventEmitter<FoodsUpdateEmitterModel>();

  subscription = new Subscription();
  loadingTable = false;
  loadingFilteringTable = false;

  foodUnitTypeTrans = FoodUnitTypeTrans;
  foodCategoriesTrans = FoodCategoryTransMap;
  foodStatusFilter = FoodStatusFilter;

  foodDetails: FoodDetails[] = [];
  pageAttr: PageSpringAttr = EmptyPageAttrObj();

  filterKeywords: string[] = [];
  filterEventEmitter = new EventEmitter<any>();
  selectedCategoriesEmitter = new EventEmitter<any>();
  foodStatusOptionsEmitter = new EventEmitter<any>();
  readonly seperatorKeysCodes: number[] = [ENTER, COMMA];

  displayedColumns: string[] = ['name', 'category', 'amountLeft', 'expirationDate', 'actions'];
  iconsForStatus: Map<EFoodStatus, string> = new Map([
    // [EFoodStatus.FRESH,'check'],
    // [EFoodStatus.GOOD, 'check'],
    [EFoodStatus.NOTFRESH,'priority_high'],
    [EFoodStatus.SPOILED, 'dangerous'],
    [EFoodStatus.TOTRY, 'warning']
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  @ViewChild('allCategoriesSelectedOption') private allCategoriesSelected!: MatOption;

  selection = new SelectionModel<FoodDetails>(true, []);
  //selectedCategoriesFilter: number[] = [];

  filterCategoriesFormCtrl = new FormControl<number[]>([]);
  filterCategoriesToRequest: number[] = [];
  filterCategoriesArr: FoodCategoryDetails[] = [];

  filterFoodStatusCtrl: string = 'ANY';

  mobileButtons: FoodTableMobileButtons[] = [];
  mobileSortHeaders: FoodTableSorterElem[] = [];
  mobileSortingEmitter = new EventEmitter<FoodTableSorterEmitter>();
  currentMobileSorting!: FoodTableSorterEmitter;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(private foodService: FoodService,
              private breakpointObserver: BreakpointObserver,
              private router: Router,
              private fb: FormBuilder,
              private foodCategoryService: FoodCategoryService,
              private dialog: MatDialog) {

    // this.filterCategoriesForm = this.fb.group({
    //   category: new FormControl('')
    // });
  }


  ngOnInit(): void {
    this.loadTableData(true);

    this.subscription.add(this.foodCategoryService.getFoodCategories()
      .subscribe({
        next: value => {
          this.filterCategoriesArr = value;
        }
      }));

    this.prepareMobileElements();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {

    this.isHandset$.subscribe(value1 => {
      if(!value1){
        console.log("dekstop!!!")

        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page,
          this.filterEventEmitter, this.selectedCategoriesEmitter,
          this.foodStatusOptionsEmitter)
          .pipe(
            tap(() => this.loadTableData())
          )
          .subscribe();
      } else {
        console.log("mobile!!!")
        this.mobileSortingEmitter.subscribe((value) => {
          this.currentMobileSorting = value;
          this.paginator.pageIndex = 0
        });

        merge(this.paginator.page, this.mobileSortingEmitter,
          this.filterEventEmitter, this.selectedCategoriesEmitter,
          this.foodStatusOptionsEmitter)
          .pipe(
            tap(() => this.loadTableData(false,false))
          )
          .subscribe();
      }
    })
  }

  handleMobileSorter($event: FoodTableSorterEmitter){
    this.mobileSortingEmitter.emit($event);
  }

  // onFoodToggled(food: FoodDetails){
  //   this.selection.toggle(food);
  //   console.log(this.selection.selected);
  // }
  //
  // toggleAllFood(){
  //   if(this.isAllFoodSelected()) {
  //     this.selection.clear();
  //   } else {
  //     this.selection.select(...this.foodDetails);
  //   }
  // }

  // isAllFoodSelected() {
  //   return this.selection.selected?.length == this.foodDetails?.length;
  // }

  private buildFoodRequestParams(){
    return FoodRequestParamsObj({
      foodStatus: EFoodStatusFilter[this.filterFoodStatusCtrl as keyof typeof EFoodStatusFilter]
    });
  }

  private loadTableData(firstLoad = false, matSortReady = true) {
    this.loadingTable = firstLoad;
    this.loadingFilteringTable = true;

    //console.log(this.filterCategoriesToRequest);

    let params;

    if(matSortReady){
      params = FoodPageHttpParams(
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? 10,
        this.sort?.direction ?? 'asc',
        this.sort?.active ?? 'expirationDate',
        this.filterKeywords,
        this.filterCategoriesToRequest,
        this.buildFoodRequestParams()
      ); //this.filterFoodStatusCtrl
    } else{
      params = FoodPageHttpParams(
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? 10,
        this.currentMobileSorting.direction ?? 'asc',
        this.currentMobileSorting.value ?? 'expirationDate',
        this.filterKeywords,
        this.filterCategoriesToRequest,
        this.buildFoodRequestParams()
      ); //this.filterFoodStatusCtrl
    }


    this.subscription.add(
      this.foodService.findFoodsByStorageId(this.storageId, params)
        .subscribe({
          next: value => {
            this.foodDetails = value.content;
            this.pageAttr = PageAttrObj(value);
            this.loadingTable = false;
            this.loadingFilteringTable = false;
          },
          error: err => {
          },
        }));

  }

  onAddFood() {
    this.router.navigate([`${APP_ROUTES.storages}/${this.storageId}/${APP_ROUTES.newFood}`]);
  }

  removeKeywordChip(keyword: string) {
    const newKeyword = keyword.toLowerCase();
    const index = this.filterKeywords.indexOf(newKeyword);

    if (index >= 0) {
      this.filterKeywords.splice(index, 1);
      this.filterEventEmitter.emit();
    }
  }

  addChipFilter(event: MatChipInputEvent) {
    const input = event.chipInput;
    const value = event.value;

    if ((value || '').trim()) {
      const newKeyword = value.trim().toLowerCase();
      if (this.filterKeywords.indexOf(newKeyword) === -1) {
        this.filterKeywords.push(newKeyword);
        this.filterEventEmitter.emit();
      }
    }

    if (input) {
      input.clear();
    }
  }

  toggleAllCategories() {
    if (this.allCategoriesSelected.selected) {
      this.filterCategoriesFormCtrl
        .patchValue([...this.filterCategoriesArr.map(cat => cat.id)])
    } else {
      console.log("toggle off");
      if (this.filterCategoriesFormCtrl.value!.length === this.filterCategoriesArr.length) {
        return;
      }

      this.filterCategoriesFormCtrl.patchValue([]);
    }
  }

  onCategoryOptionClicked() {
    //for all-categories

    // if(this.allCategoriesSelected.selected){
    //   this.allCategoriesSelected.deselect();
    // }
    // if(this.filterCategoriesFormCtrl.value!.length === this.filterCategoriesArr.length){
    //   this.allCategoriesSelected.select();
    // }
  }

  filterCategoriesChange() {
    let categoriesValue: number[] = [];
    if (this.filterCategoriesFormCtrl.value !== null) {
      categoriesValue = this.filterCategoriesFormCtrl.value;
    }

    //check if all-opt is selected
    if (categoriesValue.findIndex(c => c === -1) !== -1) {
      categoriesValue = [];
    }

    this.filterCategoriesToRequest = categoriesValue;
    this.selectedCategoriesEmitter.emit();
  }

  onFoodStatusOptionClicked() {
    this.foodStatusOptionsEmitter.emit();
  }

  //actions from rows
  onEatFoodClick(row: FoodDetails) {
    const eatFoodDialogRef = this.dialog.open(EatFoodModalComponent, {
      data: row, disableClose: true
    });

    eatFoodDialogRef.afterClosed().subscribe(result => {
        const index = this.foodDetails.findIndex(f => f.id === row.id);
        if (index !== -1 && result > 0) {
          this.foodDetails[index].unitValue = result;
        } else if(result === 0) {
         this.foodDetails = this.foodDetails.filter(food => food.id !== row.id);
         this.tableContentChange.emit({itemsCount: -1, alertsCount: -1});
        }});
  }

  onMoveToTrashClick(row: FoodDetails) {
    const moveToTrashFoodDialogRef = this.dialog.open(MoveToTrashFoodModalComponent, {
      data: row, disableClose: true, width: '300px'
    });

    moveToTrashFoodDialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.foodDetails = this.foodDetails.filter(food => food.id !== row.id);
        this.tableContentChange.emit({itemsCount: -1, alertsCount: -1});
      }
    });
  }

  onDetailsClick(row: FoodDetails) {
    const foodDetailsDialogRef = this.dialog.open(DetailsFoodModalComponent, {
      data: row
    });

  }

  onEditFoodClick(row: FoodDetails) {
    const editFoodDialogRef = this.dialog.open(EditFoodModalComponent, {
      data: row, width: '300px',disableClose: true
    });

    editFoodDialogRef.afterClosed().subscribe(result => {
      const foodResult = result as FoodDetails | null;
      console.log("result: ", foodResult);
      if(foodResult !== null){
        const index = this.foodDetails.findIndex(f => f.id === foodResult.id);
        console.log(index);
        if(index === -1){
          return;
        }
        if(foodResult.storageId !== this.storageId || foodResult.unitValue === 0 || foodResult.eaten){
         this.foodDetails = this.foodDetails.filter(f => f.id !== foodResult.id);
          this.tableContentChange.emit({itemsCount: -1, alertsCount: -1});
        } else if(row.alerted !== foodResult.alerted){
          this.tableContentChange.emit({itemsCount: 0, alertsCount: +1});
        }

        console.log("set updated ", foodResult);
        this.foodDetails = this.foodDetails.map( food => food.id === foodResult.id ? foodResult : food);
      }
    });
  }

  onThrowAllOutdatedClick() {

  }

  prepareMobileElements(){
    this.mobileButtons = [
      {icon: 'restaurant', enumAction: EFoodTableMobileAction.EAT},
      {icon: 'delete', enumAction: EFoodTableMobileAction.DELETE},
      {icon: 'edit', enumAction: EFoodTableMobileAction.EDIT},
      {icon: 'info', enumAction: EFoodTableMobileAction.DETAILS}
    ];

    this.mobileSortHeaders = [
      { value: 'name', transLabel: 'activeFoodTable.labels.name'},
      { value: 'foodCategory', transLabel: 'activeFoodTable.labels.category'},
      { value: 'unitValue', transLabel: 'activeFoodTable.labels.amount'},
      { value: 'expirationDate', transLabel: 'activeFoodTable.labels.expiration'},
    ]
  }

  handleMobileButtons($event: FoodTableMobileButtonEmitters){
    const foodId = $event.foodId;
    const food = this.foodDetails.find( value => value.id === foodId) as FoodDetails;
    if(food === undefined){
      return;
    }
    switch ($event.enumAction){
      case EFoodTableMobileAction.DELETE:
        this.onMoveToTrashClick(food);
        break;
      case EFoodTableMobileAction.DETAILS:
        this.onDetailsClick(food);
        break;
      case EFoodTableMobileAction.EDIT:
        this.onEditFoodClick(food);
        break;
      case EFoodTableMobileAction.EAT:
        this.onEatFoodClick(food);
        break;
    }
  }


}
