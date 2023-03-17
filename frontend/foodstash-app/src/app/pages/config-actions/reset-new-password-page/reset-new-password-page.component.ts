import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomFormErrorHandling} from '../../../common/utils/validators-func';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {matchValidator, passwordStrengthValidator} from '../../../common/utils/custom-validators';
import {verifyActivationRouteParam} from '../../../common/utils/checkRouteParams';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {PasswordResetModel} from '../../../common/models/user/passwordReset.model';
import {APP_ROUTES} from '../../../core/routes.table';

@Component({
  selector: 'app-reset-new-password-page',
  templateUrl: './reset-new-password-page.component.html',
  styleUrls: ['./reset-new-password-page.component.scss']
})
export class ResetNewPasswordPageComponent implements OnInit {

  subscription = new Subscription();

  resetPasswordForm!: FormGroup;

  resetFormHandling!: CustomFormErrorHandling

  tokenCheckLoading = false;
  sendingResetLoading = false;

  resetSend = false;
  resetSuccess = false;

  resetValue = ''

  constructor(private authService: AuthenticationService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private toast: ToastrService,
              private translate: TranslateService) {

    const routeId = this.route.snapshot.paramMap.get('resetValue');
    if(routeId != null){
      if(verifyActivationRouteParam(routeId)){
        this.resetValue = routeId;
      }
    }
  }


  ngOnInit(): void {

    if(this.resetValue.length === 0){
      return;
    }

    this.tokenCheckLoading = true;
    this.subscription.add(this.authService.checkPasswordResetToken(this.resetValue).subscribe({
      next:value => {
        this.tokenCheckLoading = false;
      },
      error: err => {
        this.tokenCheckLoading = false;
        this.resetValue = '';
      }
    }))

    this.resetPasswordForm = this.fb.group({
      password: [null, [Validators.required, passwordStrengthValidator(), Validators.minLength(8),
        matchValidator('retypePassword', true)]],
      retypePassword: [null, [Validators.required, matchValidator('password')]],
    })

    this.resetFormHandling = new CustomFormErrorHandling(this.resetPasswordForm);

  }

  onSaveClick() {
    if(this.resetPasswordForm.invalid || this.resetValue.length === 0){
      return;
    }

    const resetBody: PasswordResetModel = {
      newPassword: this.resetPasswordForm.value.password,
      resetToken: this.resetValue
    }

    this.sendingResetLoading = true;

    this.subscription.add(this.authService.resetPassword(resetBody).subscribe({
      next: value => {
        this.sendingResetLoading = false;
        this.resetSend = true;
        this.resetSuccess = true;
        this.fireSuccessMsg();
        setTimeout(()=>{
          this.router.navigate([APP_ROUTES.login]);
        }, 2000)

      }, error: err => {
        this.sendingResetLoading = false;
        this.resetSend = true;
        this.resetSuccess = false;
        this.fireErrorMsg();
        setTimeout(()=>{
          this.router.navigate([APP_ROUTES.login]);
        }, 2000)
      }
    }));
  }

  private fireSuccessMsg(){
    const msgs = this.translate.instant('passwordResetting.msgs.changeSuccess');
    this.toast.success(msgs['subtitle'], msgs['title']);
  }

  private fireErrorMsg(){
    const msgs = this.translate.instant('passwordResetting.msgs.changeFailure');
    this.toast.error(msgs['subtitle'], msgs['title']);
  }
}
