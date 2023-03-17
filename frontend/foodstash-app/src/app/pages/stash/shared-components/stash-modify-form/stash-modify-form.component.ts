import {Component, Input, OnInit} from '@angular/core';
import {APP_ROUTES} from '../../../../core/routes.table';
import {map, Observable, shareReplay, Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {StorageTransArr} from '../../../../common/models/storages/storage.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomFormErrorHandling} from '../../../../common/utils/validators-func';
import {StashCreate} from '../../../../common/models/stashes/stash.model';
import {AuthenticationService} from '../../../../services/authentication/authentication.service';
import {StashService} from '../../../../services/stash/stash.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-stash-modify-form',
  templateUrl: './stash-modify-form.component.html',
  styleUrls: ['./stash-modify-form.component.scss']
})
export class StashModifyFormComponent implements OnInit {

  @Input() backRouterLink = '';
  @Input() nextRouterLink = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() loadData = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  storageTransArr = StorageTransArr;
  stashCreateForm: FormGroup;
  subscription = new Subscription();

  loading = false;
  errorsMessages = '';
  errorMessageTrans = 'stashModify.storagesError';

  stashErrorHandling: CustomFormErrorHandling;

  constructor(private breakpointObserver: BreakpointObserver,
              private fb: FormBuilder,
              private stashService: StashService,
              private router: Router,
              private translator: TranslateService,
              private _toastr: ToastrService
              )
  {
    this.stashCreateForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      storages: this.fb.array([])
    });

    this.stashErrorHandling = new CustomFormErrorHandling(this.stashCreateForm);
  }

  addStorage(){
    const storageForm =  this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      storageType: ['FRIDGE', Validators.required]
    });

    this.storagesArr.push(storageForm);
  }

  deleteStorageFromArr(index: number){
    this.storagesArr.removeAt(index);
  }


  get storagesArr() {
    return this.stashCreateForm.controls["storages"] as FormArray;
  }

  //TODO: formArray validation. HOW ????


  ngOnInit(): void {
    this.addStorage()
  }

  onSave() {

    if(!this.stashCreateForm.valid){
      console.error('invalid form');
    } else if(this.storagesArr.length === 0){
      this.errorsMessages = this.errorMessageTrans;
    } else {
      this.loading = true;
      const values = this.constructStashCreateObj();
      console.log(values);
      this.subscription.add(
        this.stashService.addNewStash(values)
          .subscribe({
            next: value => {
              this.loading = false;
              this.openSuccessToast();
              this.router.navigate([this.nextRouterLink]);
            },
            error: err => {
              this.errorsMessages = err;
              this.loading = false;
            }}));
    }

  }

  //TODO stash service - wysylanie i odbieranie bledow

  constructStashCreateObj(): StashCreate{
    const values = this.stashCreateForm.getRawValue();
    const retObj: StashCreate = {
      name: values['name'],
      personal: true,
      storages: values['storages']
    }
    return retObj;
  }

  private openSuccessToast(){
   const msgs = this.translator.instant('stashModify.msgs.success');
   this._toastr.success(msgs['subtitle'], msgs['title']);
  }



}
