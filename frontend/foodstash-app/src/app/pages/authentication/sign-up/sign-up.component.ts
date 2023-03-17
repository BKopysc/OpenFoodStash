import {Component, Inject, OnInit} from '@angular/core';
import {Gender} from '../../../common/models/profile/profile.model';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {min, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import {matchValidator, passwordStrengthValidator} from '../../../common/utils/custom-validators';
import {UserRegister} from '../../../common/models/user/userAuth.model';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {ErrorResponse} from '../../../common/models/errors/error-response.model';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../../core/routes.table';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  genders: Gender[] = [
    {name: 'gender.male', value: 'MALE'},
    {name: 'gender.female', value: 'FEMALE'},
    {name: 'gender.other', value: 'OTHER'}
  ]

  minDate: Date;
  maxDate: Date;
  submitLoading = false;

  //loginLink: string[] = ['/auth/login'];

  errorForForm = '';

  subscription = new Subscription();

  registerSuccess = false;
  resendRegisterVerificationLoading = false;

  signUpForm: FormGroup;

  constructor(private fb: FormBuilder,
              private translateService: TranslateService,
              private authservice: AuthenticationService,
              private toastr: ToastrService,
              private router: Router
  ) {

    this.signUpForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required, Validators.maxLength(50)]],
      surname: [null, [Validators.required]],
      birthDate: [null, [Validators.required]],
      gender: ['male', [Validators.required]],
      password: [null, [Validators.required, passwordStrengthValidator(), Validators.minLength(8),
        matchValidator('retypePassword', true)]],
      retypePassword: [null, [Validators.required, matchValidator('password')]],
      rulesCheck: [false, [Validators.requiredTrue]]
    });

    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear() - 100, 0, 1);
    this.maxDate = new Date(currentDate.getFullYear() - 13, currentDate.getMonth(), currentDate.getDay());

  }

  public errorHandling = (control: string, error: string) => {
    //console.log(control + " " + error + " : " + this.signUpForm.controls[control].hasError(error));
    return this.signUpForm.controls[control].hasError(error);
  }

  public getLenValidator(control: string, type: 'minlength' | 'maxlength'): string {
    return this.signUpForm.controls[control].getError(type)['requiredLength'] || '';
  }


  ngOnInit(): void {

  }

  checkIfPasswordsAreEquals(): boolean {
    return (this.signUpForm.controls['password'].getRawValue() !== this.signUpForm.controls['retypePassword'].getRawValue());
  }


  fireSuccessRegister(): void {
    const trans = this.translateService.instant('auth.registerSuccess');
    this.toastr.success(trans.text, trans.header);
  }

  onFormSubmit(): void {

    if (this.signUpForm.valid) {
      this.submitLoading = true;
      const formValues = this.signUpForm.value;
      const userToRegister: UserRegister = {
        email: formValues.email,
        birthDate: formValues.birthDate,
        gender: formValues.gender,
        surname: formValues.surname,
        name: formValues.name,
        password: formValues.password
      };

      this.subscription.add(
        this.authservice.registerUser(userToRegister)
          .subscribe({
              next: value => {
                //this.fireSuccessRegister();
                this.submitLoading = false;
                this.registerSuccess = true;
                // this.router.navigate([APP_ROUTES.login]);
              },
              error: err  => {
                const errorRes = err as ErrorResponse;
                this.errorForForm = errorRes.message !== undefined ? errorRes.message : 'Error';
                this.submitLoading = false;
              }
            }
          )
      );

    } else {
      console.log("not valid")
    }
  }


  resendVerification() {
    const resendEmail = this.signUpForm.value.email;
    this.resendRegisterVerificationLoading = true;
    this.subscription.add(this.authservice.resendAccountRegistration(resendEmail)
      .subscribe({
        next:value => {
          this.resendRegisterVerificationLoading = false;
        },
         error: err => {
          this.resendRegisterVerificationLoading = false;
         }
      }));
  }
}
