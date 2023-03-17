import {Component, NgModule, Type} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewUserComponent } from './new-user/new-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {RouterModule, ROUTES, Routes} from '@angular/router';
import {AuthGuard} from '../../core/guards/auth.guard';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import { HomePageComponent } from './home-page.component';
import {NewUserGuard} from '../../core/guards/new-user.guard';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../shared/shared.module';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MtxButtonModule} from '@ng-matero/extensions/button';
import {MatIconModule} from '@angular/material/icon';



export const routes: Routes = [
  {
    path: '',
    component: NewUserComponent,
    canActivate: [NewUserGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }

];


@NgModule({
  declarations: [
    NewUserComponent,
    DashboardComponent,
    HomePageComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    RouterModule,
    CommonModule,
    TranslateModule,
    SharedModule,
    MatButtonModule,
    MatGridListModule,
    MtxButtonModule,
    MatIconModule
  ],
})
export class HomeModule { }

// export function configHandlerRoutes(authService: AuthenticationService) {
//   let routes: Routes = [];
//   if (authService.isLoggedIn()) {
//     routes = [
//       {
//         path: '',
//         component: StandardUserComponent
//       }
//     ];
//   } else {
//     routes = [
//       {
//         path: '',
//         component: NewUserComponent
//       }
//     ];
//   }
//   return routes;
// }
//
// export function getHomeComponent(): Type<Component> {
//
//   if(AuthGuard.prototype.canActivate()){
//     return  <Type<Component>> StandardUserComponent;
//   }
//   else {
//     return <Type<Component>> NewUserComponent;
//   }
//
// }
