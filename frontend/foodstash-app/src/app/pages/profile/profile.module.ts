import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainProfilePageComponent } from './main-profile-page/main-profile-page.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../core/guards/auth.guard';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MtxButtonModule} from '@ng-matero/extensions/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';

export const routes: Routes = [
  {
    path: '',
    component: MainProfilePageComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    MainProfilePageComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MtxButtonModule,
    MatIconModule,
    TranslateModule
  ]
})

export class ProfileModule { }
