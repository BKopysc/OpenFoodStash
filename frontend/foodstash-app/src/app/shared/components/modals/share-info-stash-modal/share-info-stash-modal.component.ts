import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StashService} from '../../../../services/stash/stash.service';
import {StashCollaborator, StashDetails, StashShare} from '../../../../common/models/stashes/stash.model';
import {AuthenticationService} from '../../../../services/authentication/authentication.service';

@Component({
  selector: 'app-share-info-stash-modal',
  templateUrl: './share-info-stash-modal.component.html',
  styleUrls: ['./share-info-stash-modal.component.scss']
})
export class ShareInfoStashModalComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  currentCollaborators: StashCollaborator[] = [];
  collaboratorsLoading = true;

  usersRemovingMode = false;

  isUserAnOwner = false;

  constructor(public dialogRef: MatDialogRef<ShareInfoStashModalComponent>,
              private authService: AuthenticationService,
              private stashService: StashService,
              @Inject(MAT_DIALOG_DATA) public stash: StashDetails
  ) {
    this.isUserAnOwner = this.authService.getUserData()!.username == this.stash.ownerUsername;
  }

  ngOnInit(): void {
    this.subscription.add(this.stashService.getStashCollaborators(this.stash.id).subscribe({
      next: value => {
        this.currentCollaborators = value;
        this.collaboratorsLoading = false;
      }, error: err => {
        this.collaboratorsLoading = false;
      }
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNoClick() {
    this.dialogRef.close();
  }

}

