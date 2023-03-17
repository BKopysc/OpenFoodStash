import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class NewUserGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  canActivate(){
    if(this.authService.isLoggedIn()) {
      this.router.navigate(['dashboard'])
      return false;
    } else{
      // this.router.navigate(['']);
      return true;
    }

  }

}
