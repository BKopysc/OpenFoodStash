import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddFoodPageComponent} from './add-food-page/add-food-page.component';
import {StashManagePageComponent} from '../stash/stash-manage-page/stash-manage-page.component';
import {Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {StarRatingModule} from 'angular-star-rating';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {TranslateModule} from '@ngx-translate/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import {MtxButtonModule} from '@ng-matero/extensions/button';
import {MatChip, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';


export const routes: Routes = [];

@NgModule({
  declarations: [
    AddFoodPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    StarRatingModule,
    NgxMatSelectSearchModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatListModule,
    MtxButtonModule,
  ],
  exports: [
    AddFoodPageComponent
  ]
})
export class FoodModule {
}
