import { Injectable } from '@angular/core';
import {config} from '../../core/config';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AlertDetails} from '../../common/models/alerts/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private API_URL = config.apiUrl;

  constructor(private http: HttpClient) { }

  forceAndExecuteAlerts(storageId: number): Observable<AlertDetails>{
    return this.http.post<any>(
      `${this.API_URL}/alerts/storage/${storageId}`,
      {}
    );
  }
}
