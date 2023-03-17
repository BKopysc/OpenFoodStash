package com.bkopysc.foodstash.controller;

import com.bkopysc.foodstash.dto.foodCategories.FoodCategoryDetailsDto;
import com.bkopysc.foodstash.service.foodCategories.FoodCategoriesService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/food-categories")
@PreAuthorize("hasRole('USER')")
public class FoodCategoriesController {

    private final FoodCategoriesService foodCategoriesService;

    @GetMapping("/")
    public ResponseEntity<List<FoodCategoryDetailsDto>> getFoodCategoriesDetails(){
        return  ResponseEntity.ok(foodCategoriesService.getFoodCategories());
    }

}
