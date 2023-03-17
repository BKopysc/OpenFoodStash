import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {config} from '../../core/config';

@Injectable({
  providedIn: 'root'
})
export class TestPlayService {

  private API_URL = config.apiUrl;

  constructor(private http: HttpClient) {
  }

  testAuthRequest(): Observable<any> {
    return this.http.get(
      `${this.API_URL}/auth/test`
    );
  }
}
