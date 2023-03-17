import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ErrorCatchingInterceptor} from './interceptors/error-catching.interceptor';
import {TokenInterceptorInterceptor} from './interceptors/token-interceptor.interceptor';
import {PL_DATE_FORMAT, PlDateAdapter} from './date-formats';
import {Platform} from '@angular/cdk/platform';


@NgModule({
  declarations: [],
  providers: [
    {provide: DateAdapter, useClass: PlDateAdapter, deps: [MAT_DATE_LOCALE, Platform]},
     {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},
    //{provide: MAT_DATE_FORMATS, useValue: PL_DATE_FORMAT},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorCatchingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorInterceptor,
      multi: true
    }
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}

