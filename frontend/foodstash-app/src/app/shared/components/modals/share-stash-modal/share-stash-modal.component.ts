import {Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FoodDetails} from '../../../../common/models/foods/foods.model';
import {ToastrService} from 'ngx-toastr';
import {StashService} from '../../../../services/stash/stash.service';
import {StashDetails, StashShare, StashShareDetails} from '../../../../common/models/stashes/stash.model';
import {AuthenticationService} from '../../../../services/authentication/authentication.service';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomFormErrorHandling} from '../../../../common/utils/validators-func';
import {notMatchValidator} from '../../../../common/utils/custom-validators';

@Component({
  selector: 'app-share-stash-modal',
  templateUrl: './share-stash-modal.component.html',
  styleUrls: ['./share-stash-modal.component.scss']
})
export class ShareStashModalComponent implements OnInit {

  shareActionLoading = false;

  subscription = new Subscription();
  shareForm!: FormGroup;
  errorFormHandling!: CustomFormErrorHandling;

  pendingShareRequests: StashShareDetails[] = [];
  pendingLoading = false;

  deletePendingLoadings: Map<string, boolean> = new Map<string, boolean>();

  selectedTab = 0;
  sendSuccess = false;

  constructor(private translateService: TranslateService,
              private fb: FormBuilder,
              private _toastr: ToastrService,
              public dialogRef: MatDialogRef<ShareStashModalComponent>,
              private stashService: StashService,
              private translate: TranslateService,
              private authService: AuthenticationService,
              @Inject(MAT_DIALOG_DATA) public stash: StashDetails,
  ) { }

  ngOnInit(): void {
    const userMail = this.authService.getUserData()!.username;

    this.shareForm = this.fb.group({
      email: [null,[Validators.required, Validators.email, notMatchValidator(userMail)]]
    });

    this.errorFormHandling = new CustomFormErrorHandling(this.shareForm);
  }

  onShareClick() {

    if(this.shareForm.invalid){
      return;
    }

    const data: StashShare = {
      shareEmail: this.shareForm.value.email
    }

    this.shareActionLoading = true;
    this.subscription.add(this.stashService.postShareRequestForStash(this.stash.id, data).subscribe({
      next: value => {
        this.shareActionLoading = false;
        this.sendSuccess = true;
        this.fireSuccessMsg();
        this.shareForm.reset();
      }, error: err => {
        this.shareActionLoading =false;
      }
    }));
  }

  private fireSuccessMsg(){
    const msgs = this.translate.instant('stashModals.share.msgs.sendSuccess');
    this._toastr.success(msgs['subtitle'], msgs['title']);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onInputChange() {
    if(this.sendSuccess){
      this.sendSuccess = false;
    }
  }

  onTabChange($event: number) {
    this.selectedTab = $event;

    if(this.selectedTab == 1){
      this.pendingLoading = true;
      this.subscription.add(this.stashService.getPendingStashShareRequests(this.stash.id)
        .subscribe({
          next: value => {
            this.pendingShareRequests = value;
            this.pendingLoading = false;
          }
        }));
    }
  }

  onDeletePending(pendingReq: StashShareDetails) {
    const obj: StashShare = { shareEmail: pendingReq.email};
    this.deletePendingLoadings.set(pendingReq.email, true);
    this.subscription.add(this.stashService.cancelPendingStashRequest(this.stash.id, obj).subscribe({
      next: value => {
        this.deletePendingLoadings.delete(pendingReq.email);
        this.firePendingDeleteSuccess(pendingReq.email);
        this.pendingShareRequests = this.pendingShareRequests.filter(value1 => value1.email !== pendingReq.email);
      }, error: err => {
        this.deletePendingLoadings.delete(pendingReq.email);
      }
    }));
  }

  firePendingDeleteSuccess(email: string){
    const msgTitle = this.translate.instant('stashModals.share.msgs.pendingDelete.title');
    const msgSubtitle = this.translate.instant('stashModals.share.msgs.pendingDelete.subtitle', {username: email});
    this._toastr.success(msgSubtitle, msgTitle);
  }
}
