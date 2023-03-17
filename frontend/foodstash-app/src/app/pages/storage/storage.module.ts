import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoragePageComponent } from './storage-page.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../core/guards/auth.guard';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';
import {SharedModule} from '../../shared/shared.module';
import {MatBadgeModule} from '@angular/material/badge';
import {AddFoodPageComponent} from '../food/add-food-page/add-food-page.component';
import {FoodModule} from '../food/food.module';
import {MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {StarRatingModule} from 'angular-star-rating';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';


export const routes: Routes = [
  {
    path: ':storageId',
    component: StoragePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':storageId/new-food',
    component: AddFoodPageComponent,
    canActivate: [AuthGuard]
  }
  ];

@NgModule({
  declarations: [
    StoragePageComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule,
    SharedModule,
    MatBadgeModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    StarRatingModule,
    NgxMatSelectSearchModule,
  ]
})
export class StorageModule { }
