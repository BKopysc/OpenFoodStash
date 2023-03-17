import { Injectable } from '@angular/core';
import {config} from '../../core/config';
import {HttpClient} from '@angular/common/http';
import {
  SimpleStorageStatisticModel,
  StatisticGenerateModel,
  StorageStatisticGeneratedData, StorageStatisticInfoModel,
  StorageStatisticModel
} from '../../common/models/statistics/statistic.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private API_URL = config.apiUrl;

  constructor(private http: HttpClient) { }

  generateAndGetStatistics(storageId: number, data: StatisticGenerateModel): Observable<StorageStatisticModel>{
    return this.http.post<StorageStatisticModel>(
      `${this.API_URL}/statistics/generate/storage/${storageId}`,
      data
    );
  }

  getOneStatistic(storageId: number): Observable<StorageStatisticModel> {
    return this.http.get<StorageStatisticModel>(
      `${this.API_URL}/statistics/storage/${storageId}`,
    );
  }

  getLastStatisticsList(storageId: number): Observable<SimpleStorageStatisticModel[]> {
    return this.http.get<SimpleStorageStatisticModel[]>(
      `${this.API_URL}/statistics/list/storage/${storageId}`,
    );
  }

  getOverallStatistic(storageId: number): Observable<StorageStatisticInfoModel> {
    return this.http.get<StorageStatisticInfoModel>(
      `${this.API_URL}/statistics/overall/storage/${storageId}`,
    );
  }

}
