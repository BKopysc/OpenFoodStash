import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatNativeDateModule} from '@angular/material/core';

import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localePl from '@angular/common/locales/pl';
import {ToastrModule} from 'ngx-toastr';
import { AboutComponent } from './pages/about/about.component';
import {MatCardModule} from '@angular/material/card';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {StarRatingModule} from 'angular-star-rating';
import {StoreModule} from '@ngrx/store';
import {backElementsReducer} from './state/back-elements.reducer';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';

registerLocaleData(localeEn, 'en');
registerLocaleData(localePl, 'pl');


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}



@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    NotFoundPageComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({backElements: backElementsReducer}),
        ToastrModule.forRoot({
            preventDuplicates: true,
            positionClass: 'toast-top-right',
            closeButton: true,
            progressBar: true
        }),
        StarRatingModule.forRoot(),
        HttpClientModule,
        MatNativeDateModule,
        FlexLayoutModule,
        NgxMatSelectSearchModule,
        CoreModule,
        SharedModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        }),
        MatCardModule,
        NgChartsModule,
        MatIconModule,
        MatDividerModule,
        MatGridListModule
    ],
  providers: [
    {provide: LOCALE_ID, useValue: 'en-EN'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  /*

   */
}

