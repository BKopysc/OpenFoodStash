import { Injectable } from '@angular/core';
import {config} from '../../core/config';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  StorageComplex,
  StorageCreate,
  StorageDetails,
  StorageStashDetails
} from '../../common/models/storages/storage.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private API_URL = config.apiUrl;

  constructor(private http: HttpClient) { }

  getSimpleStorageDetails(storageId: number): Observable<StorageDetails> {
    return this.http.get<StorageDetails>(
      `${this.API_URL}/storages/${storageId}`
    );
  }

  addStorage(createStorage: StorageCreate, stashId: number): Observable<StorageComplex> {
    return this.http.post<StorageComplex>(
      `${this.API_URL}/storages/stash/${stashId}`,
      createStorage
    );
  }

  getComplexStorageDetails(storageId: number): Observable<StorageComplex> {
    return this.http.get<StorageComplex>(
      `${this.API_URL}/storages/complex/${storageId}`
    )
  }

  getUserStoragesDetails(): Observable<StorageStashDetails[]> {
    return this.http.get<StorageStashDetails[]>(
      `${this.API_URL}/storages/my`
    );
  }

  getOtherInStashStorages(storageId: number): Observable<StorageStashDetails[]>{
    return this.http.get<StorageStashDetails[]>(
      `${this.API_URL}/storages/other-in-stash/${storageId}`
    );
  }

  getStorageWithStashName(storageId: number): Observable<StorageStashDetails> {
    return this.http.get<StorageStashDetails>(
      `${this.API_URL}/storages/with-stashname/${storageId}`
    );
  }
}
