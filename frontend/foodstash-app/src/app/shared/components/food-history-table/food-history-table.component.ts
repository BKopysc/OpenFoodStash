import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {CustomPaginatorImpl} from '../custom-paginator/custom-paginator-impl';
import {map, merge, Observable, shareReplay, Subscription, tap} from 'rxjs';
import {FoodUnitTypeTrans} from '../../../common/models/foods/food-unit-type.model';
import {FoodCategoryDetails, FoodCategoryTransMap} from '../../../common/models/foods/food-category.model';
import {EFoodPlaceFilter, FoodDetails, FoodPlaceFilter,} from '../../../common/models/foods/foods.model';
import {EmptyPageAttrObj, PageAttrObj, PageSpringAttr} from '../../../common/models/spring-models/page.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatSort} from '@angular/material/sort';
import {MatOption} from '@angular/material/core';
import {SelectionModel} from '@angular/cdk/collections';
import {FormBuilder, FormControl} from '@angular/forms';
import {FoodService} from '../../../services/food/food.service';
import {Router} from '@angular/router';
import {FoodCategoryService} from '../../../services/food-category/food-category.service';
import {MatDialog} from '@angular/material/dialog';
import {FoodPageHttpParams, FoodRequestParamsObj} from '../../../common/utils/http-params-helper';
import {MatChipInputEvent} from '@angular/material/chips';
import {DetailsFoodModalComponent} from '../modals/details-food-modal/details-food-modal.component';
import {RecoverFoodModalComponent} from '../modals/recover-food-modal/recover-food-modal.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {FoodsUpdateEmitterModel} from '../../../common/models/foods/foods-table.model';

@Component({
  selector: 'app-food-history-table',
  templateUrl: './food-history-table.component.html',
  styleUrls: ['./food-history-table.component.scss'],
  providers: [
    {provide: MAT_PAGINATOR_DEFAULT_OPTIONS, useValue: {formFieldAppearance: 'outline'}},
    {provide: MatPaginatorIntl, useClass: CustomPaginatorImpl}
  ]
})
export class FoodHistoryTableComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() storageId!: number;
  @Output() tableContentChange = new EventEmitter<FoodsUpdateEmitterModel>();

  subscription = new Subscription();
  loadingTable = false;
  loadingFilteringTable = false;

  foodUnitTypeTrans = FoodUnitTypeTrans;
  foodCategoriesTrans = FoodCategoryTransMap;
  foodPlaceFilter = FoodPlaceFilter;
//  foodPlaceFilterTrans = FoodPlaceFilterMap;

  trashSectionDetails = null;


  foodDetails: FoodDetails[] = [];
  pageAttr: PageSpringAttr = EmptyPageAttrObj();

  filterKeywords: string[] = [];
  filterEventEmitter = new EventEmitter<any>();
  selectedCategoriesEmitter = new EventEmitter<any>();
  foodPlaceOptionsEmitter = new EventEmitter<any>();
  readonly seperatorKeysCodes: number[] = [ENTER, COMMA];

  displayedColumns: string[] = ['name', 'category', 'amountLeft', 'processedDate', 'actions'];
  // iconsForStatus: Map<EFoodStatus, string> = new Map([
  //   // [EFoodStatus.FRESH,'check'],
  //   // [EFoodStatus.GOOD, 'check'],
  //   [EFoodStatus.NOTFRESH,'priority_high'],
  //   [EFoodStatus.SPOILED, 'dangerous'],
  //   [EFoodStatus.TOTRY, 'warning']
  // ]);

  iconsForFoodPlaces: Map<EFoodPlaceFilter | string, string> = new Map([
    [EFoodPlaceFilter.DELETED, 'block_outlined'],
    [EFoodPlaceFilter.TRASH,'delete_outlined'],
    [EFoodPlaceFilter.EATEN, 'restaurant_menu_outlined']
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('allCategoriesSelectedOption') private allCategoriesSelected!: MatOption;

  selection = new SelectionModel<FoodDetails>(true, []);
  //selectedCategoriesFilter: number[] = [];

  filterCategoriesFormCtrl = new FormControl<number[]>([]);
  filterCategoriesToRequest: number[] = [];
  filterCategoriesArr: FoodCategoryDetails[] = [];

  filterFoodPlaceCtrl: string = 'TRASH';
  EFoodPlaceFilterCopy = EFoodPlaceFilter;

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
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page,
      this.filterEventEmitter, this.selectedCategoriesEmitter,
      this.foodPlaceOptionsEmitter)
      .pipe(
        tap(() => this.loadTableData())
      )
      .subscribe();
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
      inTrash: this.filterFoodPlaceCtrl == EFoodPlaceFilter.TRASH,
      deleted: this.filterFoodPlaceCtrl == EFoodPlaceFilter.DELETED,
      eaten: this.filterFoodPlaceCtrl == EFoodPlaceFilter.EATEN
    });
  }

  private loadTableData(firstLoad = false) {
    this.loadingTable = firstLoad;
    this.loadingFilteringTable = true;

    //console.log(this.filterCategoriesToRequest);

    const params = FoodPageHttpParams(
      this.paginator?.pageIndex ?? 0,
      this.paginator?.pageSize ?? 10,
      this.sort?.direction ?? 'asc',
      this.sort?.active ?? 'expirationDate',
      this.filterKeywords,
      this.filterCategoriesToRequest,
      this.buildFoodRequestParams()
    ); //this.filterFoodStatusCtrl

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

  //actions from rows
  onDetailsClick(row: FoodDetails) {
    const foodDetailsDialogRef = this.dialog.open(DetailsFoodModalComponent, {
      data: row
    });

  }

  onFoodPlaceClicked() {
    this.foodPlaceOptionsEmitter.emit();
  }

  onRecoverFood(row: FoodDetails) {
    const recoverFoodDialogRef = this.dialog.open(RecoverFoodModalComponent, {
      data: row, width: '300px', disableClose: true
    });

    recoverFoodDialogRef.afterClosed().subscribe( result => {
      if(result === null){
        return;
      } else {
        const isAlerted = (result as FoodDetails).alerted;
        this.tableContentChange.emit({alertsCount: isAlerted ? 1 : 0, itemsCount: 1});
      }

      this.foodDetails = this.foodDetails.filter(f => f.id !== row.id) ;
    });
  }
}
