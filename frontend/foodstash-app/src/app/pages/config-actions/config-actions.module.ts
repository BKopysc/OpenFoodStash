import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordPageComponent } from './reset-password-page/reset-password-page.component';
import {RouterModule, Routes} from '@angular/router';
import {NewUserGuard} from '../../core/guards/new-user.guard';
import {AuthGuard} from '../../core/guards/auth.guard';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import { ResetNewPasswordPageComponent } from './reset-new-password-page/reset-new-password-page.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MtxButtonModule} from '@ng-matero/extensions/button';
import {SharedModule} from '../../shared/shared.module';

export const routes: Routes = [
  {
    path: 'password-reset',
    component: ResetPasswordPageComponent,
    canActivate: []
  },
  {
    path: 'password-reset/:resetValue',
    component: ResetNewPasswordPageComponent,
    canActivate: []
  }
]

@NgModule({
  declarations: [
    ResetPasswordPageComponent,
    ResetNewPasswordPageComponent
  ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatCardModule,
        MatInputModule,
        TranslateModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MtxButtonModule,
        SharedModule
    ]
})
export class ConfigActionsModule { }
