import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StorageCreate, StorageDetails, StorageTransArr} from '../../../../common/models/storages/storage.model';
import {StorageService} from '../../../../services/storage/storage.service';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageModalData} from '../../../../common/models/storages/storage-modal.model';
import {CustomFormErrorHandling} from '../../../../common/utils/validators-func';

@Component({
  selector: 'app-storage-modify-modal',
  templateUrl: './storage-modify-modal.component.html',
  styleUrls: ['./storage-modify-modal.component.scss']
})
export class StorageModifyModalComponent implements OnInit {

  storageDetails: StorageDetails | undefined;
  errorMsg = '';

  subscription = new Subscription();

  createStorageForm: FormGroup;
  storageTransArr = StorageTransArr;

  getLoading = false;
  postLoading = false;

  storageErrorHelper: CustomFormErrorHandling;

  constructor(
    public dialogRef: MatDialogRef<StorageModifyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StorageModalData,
    private storageService: StorageService,
    private fb: FormBuilder
  ) {
    dialogRef.disableClose = true;
    this.loadInitData();

    this.createStorageForm = this.fb.group({
        name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        storageType: ['FRIDGE', Validators.required]
      }
    );

    this.storageErrorHelper = new CustomFormErrorHandling(this.createStorageForm);

  }

  private loadInitData() {
    if (this.data.id !== null) {
      this.getLoading = true;
      this.subscription.add(
        this.storageService.getSimpleStorageDetails(this.data.id)
          .subscribe(
            {
              next: value => {
                this.storageDetails = value;
                this.getLoading = false;
              },
              error: err => this.errorMsg = err
            }));
    }
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick() {

    if (this.createStorageForm.invalid) {
      return;
    }

    if (this.data.id) {
      this.editStorage();
    } else {
      this.postStorage();
    }

  }

  private postStorage() {
    this.postLoading = true;
    const values = this.constructStorageObj();
    this.subscription.add(
      this.storageService.addStorage(values, this.data.stashId)
        .subscribe({
          next: value => {
            this.postLoading = false;
            this.storageDetails = value;
            //console.log(value);
            this.dialogRef.close(value);
          },
          error: err => {
            this.postLoading = false;
          }
        }))
  }

  private editStorage() {

  }

  private constructStorageObj() {
    const values = this.createStorageForm.getRawValue();
    const retObj: StorageCreate = {
      name: values['name'],
      storageType: values['storageType']
    }
    return retObj;
  }
}
