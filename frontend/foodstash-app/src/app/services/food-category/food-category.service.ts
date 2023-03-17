import { Injectable } from '@angular/core';
import {config} from '../../core/config';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FoodCategoryDetails} from '../../common/models/foods/food-category.model';

@Injectable({
  providedIn: 'root'
})
export class FoodCategoryService {

  private API_URL = config.apiUrl;

  constructor(private http: HttpClient) { }

  getFoodCategories(): Observable<FoodCategoryDetails[]> {
    return this.http.get<FoodCategoryDetails[]>(
      `${this.API_URL}/food-categories/`
    );
  }


}
