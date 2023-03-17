package com.bkopysc.foodstash.repository;

import com.bkopysc.foodstash.domain.Food;
import com.bkopysc.foodstash.domain.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Long> {

    Set<FoodCategory> findAllByNameContaining(String categoryName);
}
