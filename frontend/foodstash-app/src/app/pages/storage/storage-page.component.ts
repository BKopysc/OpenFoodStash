import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, shareReplay, Subscription} from 'rxjs';
import {StorageService} from '../../services/storage/storage.service';
import {EStorageType, StorageComplex, StorageDetails, StorageTrans} from '../../common/models/storages/storage.model';
import {ActivatedRoute} from '@angular/router';
import {verifyRouteParam} from '../../common/utils/checkRouteParams';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Store} from '@ngrx/store';
import {selectBackLocationUrl} from '../../state/back-elements.selectors';
import {BackElementsActions} from '../../state/back-elements.actions';
import {UserData} from '../../shared/components/test-table/test-table.component';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {StoredUserData} from '../../common/models/auth/auth.model';
import {FoodsUpdateEmitterModel} from '../../common/models/foods/foods-table.model';

@Component({
  selector: 'app-storage-page',
  templateUrl: './storage-page.component.html',
  styleUrls: ['./storage-page.component.scss']
})
export class StoragePageComponent implements OnInit, OnDestroy {

  storageId: number;
  backURL = '';

  subscription = new Subscription();
  //storageData: StorageComplex = {id: -1, name: '', storageType: EStorageType.FREEZER, stashName: '', stashId: -1};
  storageData!: StorageComplex;

  loadingStorage = false;
  showedTab = new Map<number, boolean>([
    [0, true],
    [1, false],
    [2, false]
  ]);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  storageTrans: Map<string, string> = StorageTrans;

  currentUser!: StoredUserData | null;

  constructor(private breakpointObserver: BreakpointObserver,
              private route: ActivatedRoute,
              private authService: AuthenticationService,
              private storageService: StorageService,
              private store: Store) {


    const routeId = this.route.snapshot.paramMap.get('storageId');
    console.log(routeId);
    if(routeId === null){
      this.storageId = -1;
    } else{
      if(!verifyRouteParam(routeId)){
        this.storageId = -1;
      }
      this.storageId = parseInt(routeId);
    }
  }

  ngOnInit(): void {

    this.currentUser = this.authService.getUserData();

    this.initStorages();
    this.store.select(selectBackLocationUrl).subscribe(v => {
      console.log(v);
      this.backURL = v;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  tabChange(index: number){
    if(this.showedTab.has(index)){
      this.showedTab.set(index, true);
    }
  }

  private prepareToFocusAfterExit(){
    if(this.backURL != '/stashes'){
      return;
    }
    console.log('from stashes')
    this.store.dispatch(BackElementsActions.savePreviousSelectedStorage(
      {stashId: this.storageData.stashId, storageId: this.storageData.id}));
  }



  getStorageType(storageType: string): string{
    const res = this.storageTrans.get(storageType);
    if(!res){
      return '';
    } else {
      return res;
    }
  }

  private initStorages() {
    this.loadingStorage = true;
    this.subscription.add(this.storageService.getComplexStorageDetails(this.storageId)
      .subscribe(
        {
          next: value => {
            this.storageData = value;
            this.loadingStorage = false;
            //this.prepareToFocusAfterExit();
          }
        }
      ))
  }

  // refreshStorage(event: boolean) {
  //   if(event){
  //     this.subscription.add(this.storageService.getComplexStorageDetails(this.storageId)
  //       .subscribe(
  //         value => this.storageData = value
  //       ));
  //   }
  // }

  refreshStorage(event: FoodsUpdateEmitterModel){
    this.storageData.alertsStats += event.alertsCount;
    this.storageData.activeFoodStats += event.itemsCount;
  }



  changeAlertsCounter(amount: number){
    this.storageData.alertsStats = amount;
  }
}
