import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  // currentLanguage: string;
  //
  // constructor(private translateService: TranslateService) {
  //   this.currentLanguage = this.translateService.currentLang;
  // }

  ngOnInit(): void {
  }

  // setLanguage(lang: string){
  //   this.translateService.use(lang);
  //   this.currentLanguage = lang;
  // }
}




