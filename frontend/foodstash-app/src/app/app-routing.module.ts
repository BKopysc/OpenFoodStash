import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './pages/authentication/login/login.component';
import {SignUpComponent} from './pages/authentication/sign-up/sign-up.component';
import {AboutComponent} from './pages/about/about.component';
import {AuthGuard} from './core/guards/auth.guard';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'stashes',
    loadChildren: () => import('./pages/stash/stash.module').then(m => m.StashModule)
  },
  {
    path: 'storages',
    loadChildren: () => import('./pages/storage/storage.module').then(m => m.StorageModule)
  },
  {path: 'about', component: AboutComponent},
  {
    path: 'activate-account',
    loadChildren:() => import('./pages/account-activation/account-activation.module').then(m => m.AccountActivationModule)
  },
  {
    path:'config',
    loadChildren:() => import('./pages/config-actions/config-actions.module').then(m => m.ConfigActionsModule)
  },
  {
    path:'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)
  },
  {path: 'not-found', component: NotFoundPageComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

