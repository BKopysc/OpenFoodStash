import {Injectable, Injector} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpResponseBase, HttpResponse
} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ToastrService} from 'ngx-toastr';
import {ErrorResponse} from '../../common/models/errors/error-response.model';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication/authentication.service';

@Injectable({ providedIn: 'root' })
export class ErrorCatchingInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService,
              private translateService: TranslateService,
              private router: Router,
              public authService: AuthenticationService) {}


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {



    const req = this.i18Check(request);

    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {

          let errorMsg = '';
          let errorResponse: ErrorResponse = {};
          let errorSnackMsg='';

          if (error.error instanceof ErrorEvent) {
            console.log('This is client side error');
            errorMsg = `Error: ${error.error.message}`;
            errorResponse.message = `${error.error.message}`
            //errorSnackMsg = `${error.error.message}`;
          } else {
            console.log('This is server side error');

            console.log("error catched!");
            console.log(error);

            if(error.error != null){
              errorResponse.message = error.error.message;
              errorResponse.statusCode = error.status;
            }
            else if(error.message != null){
              errorResponse.message = error.message;
            }
            else {
              errorResponse.message = 'Server error';
            }

            errorMsg = `Error Code: ${errorResponse.statusCode},  Message: ${errorResponse.message}`;

          }


          if(error.status !== 401 ){
            this.toastr.error(errorResponse.message, 'Error',{
              positionClass: 'toast-top-right',
              progressBar: true,
            });
          }
          else{
              this.toastr.warning(
                error.message, 'Warning',{
                  positionClass: 'toast-top-right',
                  progressBar: true});

          }


          return throwError(() => errorResponse);
        })
      )

  }

  private i18Check(request: HttpRequest<any>): HttpRequest<any>{

    const currentLang = this.translateService.currentLang;

    if(request.url.includes('/assets/i18n')){
      return request;
    }
    else {
      console.log("podmienię i dodam kolejnego headera!!")
      console.log(request.headers);
      return request.clone({
        headers: request.headers.append('Accept-Language', currentLang)
      });
    }
  }
}
