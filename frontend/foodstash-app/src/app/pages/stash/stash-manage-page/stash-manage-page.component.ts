import {Component, OnDestroy, OnInit} from '@angular/core';
import {StashService} from '../../../services/stash/stash.service';
import {StashDetails} from '../../../common/models/stashes/stash.model';
import {map, Observable, shareReplay, Subscription} from 'rxjs';
import {StorageComplex, StorageDetails, StorageTrans, StorageType} from '../../../common/models/storages/storage.model';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../../core/routes.table';
import {MatDialog} from '@angular/material/dialog';
import {StorageModifyModalComponent} from '../shared-components/storage-modify-modal/storage-modify-modal.component';
import {Store} from '@ngrx/store';
import {BackElementsActions} from '../../../state/back-elements.actions';
import {selectBackElements, selectBackLocationUrl} from '../../../state/back-elements.selectors';
import {BackLocationState} from '../../../state/back-elements.reducer';
import {
  ShareStashModalComponent
} from '../../../shared/components/modals/share-stash-modal/share-stash-modal.component';
import {StoredUserData} from '../../../common/models/auth/auth.model';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {
  ShareInfoStashModalComponent
} from '../../../shared/components/modals/share-info-stash-modal/share-info-stash-modal.component';

@Component({
  selector: 'app-stash-manage-page',
  templateUrl: './stash-manage-page.component.html',
  styleUrls: ['./stash-manage-page.component.scss']
})
export class StashManagePageComponent implements OnInit, OnDestroy {

  userStashes: StashDetails[] = [];
  subscription = new Subscription();
  storeSub = new Subscription();
  stashLoading = false;
  isStashEmpty = false;

  storageToFocus: { storageId: number, stashId: number } | undefined;

  storageTrans: Map<string, string> = StorageTrans;

  expandedStorages: Set<number> = new Set<number>();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  currentUser!: StoredUserData;


  constructor(private breakpointObserver: BreakpointObserver,
              private stashService: StashService,
              private authService: AuthenticationService,
              private router: Router,
              private dialog: MatDialog,
              private store: Store) {
  }

  ngOnInit(): void {

    this.stashLoading = true;

    const userData = this.authService.getUserData();
    if(userData !== null){
      this.currentUser = userData;
    }

    this.subscription.add(
      this.stashService.getUserStashes()
        .subscribe({
            next: value => {
              this.userStashes = value;
              this.stashLoading = false;
              this.focusWhenBackFromStorage();
              this.checkStashSize();
            },
            error: err => {
              this.stashLoading = false;
            }
          }
        )
    )

    this.store.dispatch(BackElementsActions.savePreviousUrl({backUrl: this.router.url}));
    //this.store.select(selectBackLocationUrl).subscribe(v=> console.log(v));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.storeSub.unsubscribe();
  }

  private focusWhenBackFromStorage() {
    if (this.userStashes.length === 0) {
      return;
    }
    this.storeSub.add(
      this.store.select(selectBackElements).subscribe(v => {
        const value = v as unknown as BackLocationState;
        console.log('store sub')
        console.log(value);
        if (value.wasStorageSelectedBefore) {
          this.storageToFocus = {storageId: value.storageId!, stashId: value.stashId!};
          this.expandStorages(this.storageToFocus.stashId);
          this.store.dispatch(BackElementsActions.resetPreviousSelectedStorage());
        }
        this.storeSub.unsubscribe();
      })
    );
  }


  getStorageType(storageType: string): string {
    const res = this.storageTrans.get(storageType);
    if (!res) {
      return '';
    } else {
      return res;
    }
  }

  checkStashSize() {
    if (this.userStashes.length === 0) {
      this.isStashEmpty = true;
    }
  }

  expandStorages(stashId: number) {
    if (this.expandedStorages.has(stashId)) {
      this.expandedStorages.delete(stashId);
    } else {
      this.expandedStorages.add(stashId);
    }
  }

  onStorageClick(stashId: number, storageId: number) {

    this.store.dispatch(BackElementsActions.savePreviousSelectedStorage({
      stashId: stashId, storageId: storageId
    }));

    this.storeSub.unsubscribe();

    this.router.navigate([APP_ROUTES.storages, storageId]);
  }

  onAddNewStash() {
    this.router.navigate([APP_ROUTES.newStash]);
  }

  onAddNewStorage(stashId: number) {
    //this.router.navigate([APP_ROUTES.newStorage, `${id}`]);
    const dialogRef = this.dialog.open(StorageModifyModalComponent, {
      width: '300px',
      data: {
        id: null,
        stashId: stashId,
        title: 'storageModifyModal.addTitle'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined) {
        const newStorage = result as StorageComplex;
        const index = this.userStashes.findIndex(value => value.id === stashId);
        console.log(newStorage);
        console.log(index);
        this.userStashes[index].storages.push(newStorage);
      }
    });
  }

  openStorageCreateDialog(stashId: number) {

  }

  onStashShare(stash: StashDetails) {

    if(stash.ownerUsername !== this.currentUser.username){
      return;
    }

    const dialogRef = this.dialog.open(ShareStashModalComponent, {
      disableClose: true, data: stash
    })

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  onShareStashInfo(stash: StashDetails) {

    const dialogRef = this.dialog.open(ShareInfoStashModalComponent, {
      disableClose: true, data: stash,  minWidth: '300px', maxWidth: '400px'
    });
  }
}
