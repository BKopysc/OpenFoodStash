package com.bkopysc.foodstash.service.foodCategories;

import com.bkopysc.foodstash.domain.FoodCategory;
import com.bkopysc.foodstash.dto.foodCategories.FoodCategoryDetailsDto;
import com.bkopysc.foodstash.repository.FoodCategoryRepository;
import com.bkopysc.foodstash.utils.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class FoodCategoriesImpl implements FoodCategoriesService{

    private final FoodCategoryRepository foodCategoryRepository;
    private final ModelMapper modelMapper;

    private final String FOOD_CATEGORY_NOT_FOUND="foodCategory.error.notFound";

    @Override
    public List<FoodCategoryDetailsDto> getFoodCategories() {

        List<FoodCategory> foodCategories = foodCategoryRepository.findAll();

        return foodCategories.stream()
                .map( foodCategory -> modelMapper.map(foodCategory, FoodCategoryDetailsDto.class))
                .toList();
    }

    @Override
    public FoodCategory getRawFoodCategory(Long id) {

        return foodCategoryRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(FOOD_CATEGORY_NOT_FOUND));
    }
}
