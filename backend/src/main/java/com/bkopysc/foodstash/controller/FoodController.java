package com.bkopysc.foodstash.controller;

import com.bkopysc.foodstash.dto.SimpleResponse;
import com.bkopysc.foodstash.dto.foods.*;
import com.bkopysc.foodstash.dto.params.EFoodStatusParam;
import com.bkopysc.foodstash.service.foods.FoodsService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/foods")
@PreAuthorize("hasRole('USER')")
public class FoodController {

    private final FoodsService foodService;

    @GetMapping("/storage/{id}")
    public ResponseEntity<Page<FoodDetailsDto>> getFoodPageByStorageId(@PathVariable Long id, Authentication authentication, Pageable pageable,
                                                                       @RequestParam(required = false) List<String> filterData,
                                                                       @RequestParam(required = false) List<Long> foodCategoryIds,
                                                                       FoodRequestParamDto foodRequestParam){
        return ResponseEntity.ok(foodService.getFoodDetailsListByStorage(id, authentication, pageable, filterData, foodCategoryIds, foodRequestParam));
    }

    @PostMapping("/")
    public ResponseEntity<SimpleResponse> addListOfFood(@Valid @RequestBody List<FoodCreateDto> foodDetailsDtoList, Authentication authentication){
        return ResponseEntity.ok(foodService.addFoodList(foodDetailsDtoList, authentication));
    }

    @PutMapping("/{id}/consume")
    public ResponseEntity<FoodDetailsDto> consumeFood(@PathVariable Long id, @Valid @RequestBody FoodConsumeDto foodConsumeDto, Authentication authentication){
        return ResponseEntity.ok(foodService.consumeFood(id, foodConsumeDto, authentication));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodDetailsDto> editFood(@PathVariable Long id, @Valid @RequestBody FoodEditDto foodEditDto, Authentication authentication){
        return ResponseEntity.ok(foodService.editFood(id, foodEditDto, authentication));
    }

    @PostMapping("/{id}/to-trash")
    public ResponseEntity<SimpleResponse> moveFoodToTrash(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok(foodService.moveFoodToTrash(id, authentication));
    }

    @PostMapping("/{id}/recover")
    public ResponseEntity<SimpleResponse> recoverFood(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok(foodService.recoverFood(id, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SimpleResponse> deleteFood(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok(foodService.deleteFood(id, authentication));
    }

    @PostMapping("/throw-all-outdated")
    public ResponseEntity<SimpleResponse> throwAllOutdatedFood(@RequestBody List<Long> storagesIds, Authentication authentication){
        return  ResponseEntity.ok(foodService.throwAllOutdatedFoodsFromStorages(storagesIds, authentication));
    }


}
