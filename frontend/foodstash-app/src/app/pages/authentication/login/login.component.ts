import { Component, OnInit } from '@angular/core';
import {Gender} from '../../../common/models/profile/profile.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {UserLogin} from '../../../common/models/user/userAuth.model';
import {ErrorResponse} from '../../../common/models/errors/error-response.model';
import {Router, ROUTES} from '@angular/router';
import {APP_ROUTES} from '../../../core/routes.table';
import {ToastrModule, ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitLoading = false;

  subscription = new Subscription();

  appRoutes = APP_ROUTES;

  loginForm: FormGroup;
  errorForForm = '';

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private router: Router,
              private _toastr: ToastrService
              ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]]
    })
  }

  public errorHandling = (control: string, error: string) => {
    return this.loginForm.controls[control].hasError(error);
  }

  public getLenValidator(control: string, type: 'minlength' | 'maxlength'): string {
    return this.loginForm.controls[control].getError(type)['requiredLength'] || '';
  }

  onFormSubmit() {
    if(this.loginForm.valid){
      this.submitLoading = true;
      const formValues = this.loginForm.value;

      const userToLogin: UserLogin = {
        email: formValues.email,
        password: formValues.password
      }

      this.subscription.add(
        this.authService.loginUser(userToLogin)
          .subscribe({
            next: value => {
              this.submitLoading = false;
              this.router.navigate([this.appRoutes.dashboard]);
            },
            error: err => {
              const errorRes = err as ErrorResponse;
              this.errorForForm = errorRes.message !== undefined ? errorRes.message : 'Error';
              this.submitLoading = false;
              this.loginForm.controls['password'].reset();
            }
          })
      )
    }
  }

  ngOnInit(): void {

  }
}
