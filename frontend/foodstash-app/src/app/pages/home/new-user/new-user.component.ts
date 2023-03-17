import { Component, OnInit } from '@angular/core';
import {APP_ROUTES} from '../../../core/routes.table';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  constructor() { }

  loginLink = APP_ROUTES.login;
  signupLink = APP_ROUTES.signup;

  ngOnInit(): void {
  }

}
