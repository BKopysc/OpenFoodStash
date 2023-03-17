import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomFormErrorHandling} from '../../../common/utils/validators-func';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.scss']
})
export class ResetPasswordPageComponent implements OnInit, OnDestroy {

  subscription = new Subscription();

  resetPasswordForm!: FormGroup;

  resetFormHandling!: CustomFormErrorHandling

  sendingResetLoading = false;
  resetRequestSend = false;

  constructor(private authService: AuthenticationService,
              private fb: FormBuilder,
              private toast: ToastrService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    })

    this.resetFormHandling = new CustomFormErrorHandling(this.resetPasswordForm);
  }



  onResetClick() {
    if(this.resetPasswordForm.invalid){
      return;
    }

    const email = this.resetPasswordForm.value.email;

    this.sendingResetLoading = true;
    this.subscription.add(this.authService.resetPasswordRequest(email)
      .subscribe({
        next: value => {
          this.sendingResetLoading = false;
          this.resetRequestSend = true;
          this.fireSuccessMsgs();
        },
        error: err => {
          this.sendingResetLoading = false;
        }}));
  }

  private fireSuccessMsgs(){
    const msgs = this.translate.instant('passwordResetting.msgs.sendSuccess');
    this.toast.success(msgs['subtitle'], msgs['title']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
