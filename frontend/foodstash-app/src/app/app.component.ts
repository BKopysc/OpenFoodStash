import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SUPPORTED_LANGUAGES} from './core/supported-languages';
import {AuthenticationService} from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'foodstash-app';

  isLoggedin = false;

  constructor(translate: TranslateService,
              authService: AuthenticationService) {
    translate.addLangs(SUPPORTED_LANGUAGES.map(l => l.code));
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang?.match(/en|pl/) ? browserLang: 'en');
  }
}
