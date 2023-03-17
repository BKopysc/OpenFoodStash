package com.bkopysc.foodstash.service.foods;

import com.bkopysc.foodstash.dto.SimpleResponse;
import com.bkopysc.foodstash.dto.foods.*;
import com.bkopysc.foodstash.dto.params.EFoodStatusParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface FoodsService {

    Page<FoodDetailsDto> getFoodDetailsListByStorage(Long storageId, Authentication authentication, Pageable pageable,
                                                     List<String> filterData, List<Long> foodCategoryIds,
                                                     FoodRequestParamDto foodRequestParamDto);

    Page<FoodDetailsDto> getFoodDetailsListByStash(Long stashId, Authentication authentication, Pageable pageable,
                                                   List<String> filterData, List<Long> foodCategoryIds,
                                                   FoodRequestParamDto foodRequestParamDto);
    SimpleResponse addFoodList(List<FoodCreateDto> foodCreateDtoList, Authentication authentication);

    FoodDetailsDto consumeFood(Long id, FoodConsumeDto foodConsumeDto, Authentication authentication);

    FoodDetailsDto editFood(Long id, FoodEditDto foodEditDto, Authentication authentication);

    SimpleResponse recoverFood(Long id, Authentication authentication);

    SimpleResponse moveFoodToTrash(Long id, Authentication authentication);

    SimpleResponse deleteFood(Long id, Authentication authentication);

    SimpleResponse throwAllOutdatedFoodsFromStorages(List<Long> storageIds, Authentication authentication);
}
