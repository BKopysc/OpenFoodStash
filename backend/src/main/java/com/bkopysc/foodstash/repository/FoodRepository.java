package com.bkopysc.foodstash.repository;

import com.bkopysc.foodstash.domain.Food;
import com.bkopysc.foodstash.domain.Storage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Set;

public interface FoodRepository extends JpaRepository<Food, Long>, QuerydslPredicateExecutor<Food> {

    Page<Food> findAllByStorage(Storage storage, Pageable pageable);

    @Query(value = "SELECT f FROM Food f WHERE f.storage.id IN :storagesIds AND f.expirationDate < current_date")
    List<Food> findOutdatedFoodsByStorages(@Param("storages") Set<Long> storagesIds);

    @Query("SELECT COUNT(e) FROM Food e WHERE e.storage.id = :storageId AND e.inTrash = false AND e.isEaten = false AND e.deleted = false")
    long countActiveByStorage(@Param("storageId") Long storageId);

    @Query("SELECT f FROM Food f WHERE f.inTrash = false AND f.isEaten = false AND f.deleted = false AND f.storage.id = :storageId")
    List<Food> getActiveFoodsByStorageId(@Param("storageId") Long storageId);




}
