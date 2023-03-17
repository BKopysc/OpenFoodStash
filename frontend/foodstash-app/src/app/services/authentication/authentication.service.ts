import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserLogin, UserRegister} from '../../common/models/user/userAuth.model';
import {Observable, tap} from 'rxjs';
import {config} from '../../core/config';
import {RefreshTokenCall, StoredUserData, LocalStorageDataNames, Tokens} from '../../common/models/auth/auth.model';
import {PasswordResetModel} from '../../common/models/user/passwordReset.model';
import {UserInfo} from '../../common/models/user/userInfo.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private API_URL = config.apiUrl;

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  private readonly DATA_NAMES = LocalStorageDataNames;
  //private readonly ROLES= [];

  private loggedUser: string = '';


  @Output() fireIsLoggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() fireIsLogout: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {}

  registerUser(user: UserRegister): Observable<any> {
    return this.http.post(
      `${this.API_URL}/auth/register`,
      user
    );
  }

  activateAccount(activationValue: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/auth/activate-account/${activationValue}`,
      {}
    );
  }

  resendAccountRegistration(email: string): Observable<any>{
    return this.http.post(
      `${this.API_URL}/auth/resend-register-request`,
      {email: email}
    );
  }

  resetPasswordRequest(email: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/auth/password-reset-request`,
      {email: email}
    );
  }

  resetPassword(resetBody: PasswordResetModel): Observable<any>{
    return this.http.post(
      `${this.API_URL}/auth/password-reset`,
      resetBody
    )
  }

  getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(
      `${this.API_URL}/auth/user-info`
    );
  }

  checkPasswordResetToken(resetValue: string): Observable<any> {
    return this.http.get(
      `${this.API_URL}/auth/password-reset/check/${resetValue}`
    );
  }

  loginUser(user: UserLogin): Observable<any> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    const body = new URLSearchParams();
    body.set('email', user.email);
    body.set('password', user.password);

    return this.http.post(
      `${this.API_URL}/auth/login`,
      body.toString(),
      options
    ).pipe(
      tap(data => {
        const resp = data as Tokens;
        this.doLoginUser(user.email, resp)
        //this.doLoginUser(user.email, tokens)
      })
    )
  }

  logoutUser(): void {
    this.doLogoutUser();
  }

  // logoutUser(): Observable<any> {
  //   return new Observable<any>(subscriber => {
  //     subscriber.next(this.doLogoutUser());
  //   });
  // }


  refreshToken() {

    //TODO: zmienic na wysylanie w body!!! To dziala ale może coś się psuć!

    console.log("refreshToken service call");

    const headers = new HttpHeaders();
    headers.append("AuthorizationRefresh", `Bearer ${this.getRefreshToken()}`);
    return this.http.get<any>(`${this.API_URL}/auth/token/refresh`,
      {headers: new HttpHeaders().set("AuthorizationRefresh", `Bearer ${this.getRefreshToken()}`)}
      )
      .pipe(tap(data => {
        const resp = data as RefreshTokenCall;
        this.storeRefreshTokenData(resp);
      }))
  }

  //getters

  getJwtToken(){
    return localStorage.getItem(this.DATA_NAMES.JWT_TOKEN);
  }

  getRefreshToken(){
    return localStorage.getItem(this.DATA_NAMES.REFRESH_TOKEN);
  }

  getUserData(): StoredUserData | null {
    const userDataFromStorage = localStorage.getItem(this.DATA_NAMES.USER_DATA);
    if(userDataFromStorage !== null) {
      return JSON.parse(userDataFromStorage) as StoredUserData;
    }
    else{
      return null;
    }
  }

  isLoggedIn(){
    return !this.shouldLogout();
  }

  shouldLogout(): boolean{
    const expireDateFromStorage = localStorage.getItem(this.DATA_NAMES.EXPIRES_AT);
    const jwtToken = this.getJwtToken();
    const refreshToken = this.getRefreshToken();
    const userData = this.getUserData();

    if(expireDateFromStorage === null || jwtToken === null || refreshToken === null || userData === null){
      this.logoutUser();
      return true;
    }
    else {
      const expireDate = new Date(expireDateFromStorage);
      const currentDate = new Date();
      if(expireDate < currentDate) {
        this.doLogoutUser();
        return true;
      }
    }

    return false;
  }




  //privates methods

  private doLoginUser(email: string, tokens: Tokens) {
    this.loggedUser = email;
    this.storeTokensData(tokens);
    this.fireIsLoggedIn.emit(true);
  }

  private doLogoutUser(){
    this.loggedUser = '';
    this.removeLocalStorage();
    this.fireIsLogout.emit(true);
  }

  getLoggedInEmitter() {
    return this.fireIsLoggedIn;
  }

  getLogoutEmitter(){
    return this.fireIsLogout;
  }

  private removeLocalStorage(){
    const objectNamesValues = Object.values(this.DATA_NAMES);
    const objectNames = objectNamesValues.slice(0, Math.ceil(objectNamesValues.length/2));
    objectNames.forEach( o => localStorage.removeItem(o));
  }

  private storeRefreshTokenData(tokens: RefreshTokenCall){
    localStorage.setItem(this.DATA_NAMES.JWT_TOKEN, tokens.access_token);
    localStorage.setItem(this.DATA_NAMES.REFRESH_TOKEN, tokens.refresh_token);
  }

   private storeTokensData(tokens: Tokens){
    localStorage.setItem(this.DATA_NAMES.JWT_TOKEN, tokens.access_token);
    localStorage.setItem(this.DATA_NAMES.REFRESH_TOKEN, tokens.refresh_token);
    localStorage.setItem(this.DATA_NAMES.EXPIRES_AT, tokens.expires_at);

    const userData: StoredUserData = {
      username: tokens.username,
      roles: tokens.roles
    }

    localStorage.setItem(this.DATA_NAMES.USER_DATA, JSON.stringify(userData));
   }


}
