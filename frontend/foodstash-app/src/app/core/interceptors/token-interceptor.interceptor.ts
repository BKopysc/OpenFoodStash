import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {RefreshTokenCall} from '../../common/models/auth/auth.model';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthenticationService,
              private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if(this.authService.getJwtToken()) {
      request = this.addToken(request, this.authService.getJwtToken());
      console.log("add token req, ", this.authService.getJwtToken());
    }

    return next.handle(request)
      .pipe(catchError(
        error => {
          if(error instanceof HttpErrorResponse && error.status === 401){
            console.log("mam error 401!");
            return this.handle401Error(request, next);
          } else {
            console.log("wystrzelam error!")
            console.log(error);
            return throwError(error);
          }
        }
      ));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler){
    if(!this.isRefreshing){
      console.log("odpalam do refresh-a")
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken()
        .pipe(
          catchError( e => {
            console.log("nowy token niewazny");
            this.refreshTokenInvalid();
            return throwError(() => e);
          }),
        switchMap((token: any) => {
          console.log("pierwsyz switch, ", token);
          const resp = token as RefreshTokenCall;
          console.log("resp1, ", resp);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(resp.access_token);
          return next.handle(this.addToken(request, resp.access_token))
        }),
      )
    }
    else{
      console.log("dalsza czesc po refreshu")
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          console.log("switch! jwt: ", jwt);
          return next.handle(this.addToken(request,jwt));
        })
      )
    }
  }

  private refreshTokenInvalid(){
    this.authService.logoutUser();
    this.router.navigate(['/auth/login']);
  }

  private addToken(request: HttpRequest<any>, token: string | null){

    //let headerVal: string | null = '';
    if(request.headers.has('AuthorizationRefresh')) {
      console.log("refreshToHeader")
      //headerVal = request.headers.get('AuthorizationRefresh');
      return request;
    } else {
      const headerVal = `Bearer ${token}`;
      console.log("jwtToHoeader");
      // const copiedHeaders = request.headers.append('Authorization', `${headerVal}`);
      // return request.clone({
      //     headers: copiedHeaders
      //   }
      // );
      return request.clone({
        setHeaders:{
          'Authorization': `${headerVal}`
        }
      });
    }



  }
}
