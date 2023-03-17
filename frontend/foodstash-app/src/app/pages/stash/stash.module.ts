import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StashSharePageComponent } from './stash-share-page/stash-share-page.component';
import { StashManagePageComponent } from './stash-manage-page/stash-manage-page.component';
import { StashPageComponent } from './stash-page/stash-page.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../core/guards/auth.guard';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {TranslateModule} from '@ngx-translate/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatRippleModule} from '@angular/material/core';
import { StashCreatePageComponent } from './stash-create-page/stash-create-page.component';
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { StashModifyFormComponent } from './shared-components/stash-modify-form/stash-modify-form.component';
import {MtxButtonModule} from '@ng-matero/extensions/button';
import { StorageModifyModalComponent } from './shared-components/storage-modify-modal/storage-modify-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { StashShareAcceptPageComponent } from './stash-share-accept-page/stash-share-accept-page.component';


export const routes: Routes = [
  {
    path: '',
    component: StashManagePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'new',
    component: StashCreatePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'invitation-accept/:inviteToken',
    component: StashShareAcceptPageComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    StashSharePageComponent,
    StashManagePageComponent,
    StashPageComponent,
    StashCreatePageComponent,
    StashModifyFormComponent,
    StorageModifyModalComponent,
    StashShareAcceptPageComponent
  ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        MatBadgeModule,
        TranslateModule,
        MatChipsModule,
        MatRippleModule,
        SharedModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MtxButtonModule,
        MatDialogModule,
    ]
})
export class StashModule { }
