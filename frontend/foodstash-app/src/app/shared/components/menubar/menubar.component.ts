import { Component, OnInit } from '@angular/core';
import {SUPPORTED_LANGUAGES} from '../../../core/supported-languages';
import {map, Observable, shareReplay} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {
  leftDefaultRoutes,
  leftLoggedRoutes,
  MenubarRoutes,
  rightDefaultRoutes,
  rightLoggedRoutes
} from './menubar.routes';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../../core/routes.table';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {

  languages = SUPPORTED_LANGUAGES
  selectedLang = this.translate.currentLang;
  appTitle = "Foodstash";

  //userData
  isUserLoggedIn = false;
  username = 'none';

  profileRoute = APP_ROUTES.profile;

  public leftRoutes: MenubarRoutes[] = [];
  public rightRoutes: MenubarRoutes[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              public translate: TranslateService,
              private authService: AuthenticationService,
              private router: Router) {}


  translateLanguageTo(event: string){
    console.log("change lang: ", event);
    this.translate.use(event);
  }


  logoutUser() {
    this.authService.logoutUser();
    this.router.navigate(['auth/login']);
  }

  homePageButton(){
    this.router.navigate(['']);
  }


  ngOnInit(): void {

    this.firstCheck();

    this.authService.getLoggedInEmitter().subscribe(
      (r) => this.checkLoggedUser()
    );

    this.authService.getLogoutEmitter().subscribe(
      (r) => this.checkLogoutUser()
    );

  }

  private firstCheck(){
    this.checkLoggedUser();
    this.checkRoutes();
  }

  private checkRoutes(){
    if(!this.isUserLoggedIn){
      this.leftRoutes = leftDefaultRoutes;
      this.rightRoutes = rightDefaultRoutes;
    }
    else {
      this.leftRoutes = leftLoggedRoutes;
    }
  }

  private checkLoggedUser(){
    this.isUserLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUserData()?.username || '';
    this.checkRoutes();
  }

  private checkLogoutUser(){
    this.isUserLoggedIn = false;
    this.username='';
    this.checkRoutes();
  }

}
