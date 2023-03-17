import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountActivationPageComponent } from './account-activation-page/account-activation-page.component';
import {RouterModule, Routes} from '@angular/router';
import {NewUserGuard} from '../../core/guards/new-user.guard';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';

export const routes: Routes = [
  {
    path: ':activationId',
    component: AccountActivationPageComponent,
    canActivate: [NewUserGuard]
  }
]

@NgModule({
  declarations: [
    AccountActivationPageComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SharedModule,
    TranslateModule
  ]
})
export class AccountActivationModule { }
