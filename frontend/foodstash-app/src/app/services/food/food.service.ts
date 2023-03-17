import { Injectable } from '@angular/core';
import {config} from '../../core/config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, mergeMap, Observable, of} from 'rxjs';
import {FoodConsumeModel, FoodCreateModel, FoodDetails, FoodEditModel} from '../../common/models/foods/foods.model';
import {PageSpring} from '../../common/models/spring-models/page.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private API_URL = config.apiUrl;

  constructor(private http: HttpClient) { }

  findFoodsByStorageId(storageId: number, cparams: HttpParams): Observable<PageSpring<FoodDetails>> {
    //      .pipe(map(data => data.content));
    return this.http.get<PageSpring<FoodDetails>>(`${this.API_URL}/foods/storage/${storageId}`, {
      params: cparams
    })

  }

  addFoods(foodData: FoodCreateModel[]): Observable<any> {
    return this.http.post(
      `${this.API_URL}/foods/`,
      foodData
    )
  }

  consumeFood(foodId: number, foodConsumeData: FoodConsumeModel): Observable<FoodDetails> {
    return this.http.put<FoodDetails>(
      `${this.API_URL}/foods/${foodId}/consume`,
      foodConsumeData
    )
  }

  moveFoodToTrash(foodId: number): Observable<any> {
    return this.http.post(
      `${this.API_URL}/foods/${foodId}/to-trash`,
      {}
    );
  }

  throwAllOutdatedFood(): Observable<any> {
    return this.http.post(
      `${this.API_URL}/foods/throw-all-outdated`,
      {}
    );
  }

  deleteFood(foodId: number): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/foods/${foodId}`,
    );
  }

  editFood(foodId: number, foodBody: FoodEditModel ): Observable<FoodDetails> {
    return this.http.put<FoodDetails>(
      `${this.API_URL}/foods/${foodId}`,
      foodBody
    );
  }

  recoverFood(foodId: number): Observable<any> {
    return this.http.post(
      `${this.API_URL}/foods/${foodId}/recover`,
      {}
    );
  }
}
