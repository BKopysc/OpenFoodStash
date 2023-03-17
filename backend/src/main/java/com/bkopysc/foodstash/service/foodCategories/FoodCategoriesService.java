package com.bkopysc.foodstash.service.foodCategories;

import com.bkopysc.foodstash.domain.FoodCategory;
import com.bkopysc.foodstash.dto.foodCategories.FoodCategoryDetailsDto;

import java.util.List;

public interface FoodCategoriesService {

    List<FoodCategoryDetailsDto> getFoodCategories();

    FoodCategory getRawFoodCategory(Long id);
}
