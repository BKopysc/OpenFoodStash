import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {StoredUserData} from '../../../common/models/auth/auth.model';
import {Subscription} from 'rxjs';
import {UserInfo} from '../../../common/models/user/userInfo.model';
import {APP_ROUTES} from '../../../core/routes.table';

@Component({
  selector: 'app-main-profile-page',
  templateUrl: './main-profile-page.component.html',
  styleUrls: ['./main-profile-page.component.scss']
})
export class MainProfilePageComponent implements OnInit {

  currentUser!: UserInfo;
  subscription: Subscription = new Subscription();
  loadingUserInfo = true;

  passwordChangeRoute = APP_ROUTES.passwordReset;

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    //this.currentUser = this.authService.getUserData();

    this.subscription.add(this.authService.getUserInfo().subscribe(
      {
        next: value => {
          this.currentUser = value;
          this.loadingUserInfo = false;
        }
      }
    ));
  }

}
