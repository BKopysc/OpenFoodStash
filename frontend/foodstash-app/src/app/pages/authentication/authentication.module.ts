import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from './login/login.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {RouterModule, Routes} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MtxButtonModule} from '@ng-matero/extensions/button';
import {NewUserGuard} from '../../core/guards/new-user.guard';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NewUserGuard]
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [NewUserGuard]
  }
];

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDividerModule,
    MatButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MtxButtonModule,
  ]
})
export class AuthenticationModule { }
