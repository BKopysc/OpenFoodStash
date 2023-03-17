import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  isLoggedIn$: boolean;

  //TODO b.kopysc: ogarnac observable

  constructor(private authService: AuthenticationService) {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  ngOnInit(): void {

  }

}
