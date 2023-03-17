import { Injectable } from '@angular/core';
import {config} from '../../core/config';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DashboardSimple} from '../../common/models/dashboard/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private API_URL = config.apiUrl;

  constructor(private http: HttpClient) { }

  getSimpleDashboard(): Observable<DashboardSimple> {
    return this.http.get<DashboardSimple>(
      `${this.API_URL}/dashboard/simple`,
    )
  }
}
