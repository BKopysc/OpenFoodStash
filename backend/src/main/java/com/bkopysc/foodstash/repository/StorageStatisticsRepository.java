package com.bkopysc.foodstash.repository;

import com.bkopysc.foodstash.domain.StorageStatistics;
import com.bkopysc.foodstash.repository.statisticRepositoryInterfaces.IStorageStatisticActualInfo;
import com.bkopysc.foodstash.repository.statisticRepositoryInterfaces.IStorageStatisticCategoryCount;
import com.bkopysc.foodstash.repository.statisticRepositoryInterfaces.IStorageStatisticCount;
import com.bkopysc.foodstash.repository.statisticRepositoryInterfaces.IStorageStatisticSimple;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface StorageStatisticsRepository extends JpaRepository<StorageStatistics, Long> {

    @Query(value = "SELECT storage_id, " +
            "sum(case when added_date between :startDate and :endDate then 1 else 0 end) as added, " +
            "sum(case when is_eaten = true AND processed_date between :startDate AND :endDate then 1 else 0 end) as eaten, " +
            "sum(case when in_trash = true AND processed_date between :startDate AND :endDate then 1 else 0 end) as inTrash, " +
            "sum(case when deleted = true AND processed_date between :startDate AND :endDate then 1 else 0 end) as deleted, " +
            "sum(case when in_trash = true AND processed_date between :startDate AND :endDate and processed_date > expiration_date then 1 else 0 end) as wasted, " +
            "sum(case when is_eaten = true AND processed_date between :startDate AND :endDate and processed_date > expiration_date then 1 else 0 end) as eatenAfter " +
            "FROM food " +
            "WHERE storage_id = :storageId " +
            "group by storage_id ", nativeQuery = true)
    IStorageStatisticCount getStorageStatisticCount(@Param("storageId") Long storageId, @Param("startDate") Date startDate,
                                                    @Param("endDate") Date endDate);

    @Query(value = "SELECT storage_id, " +
            "COUNT(storage_id) as allAddedFood, " +
            "sum(case when is_alerted = true and is_eaten = false and in_trash = false and deleted = false then 1 else 0 end) as allAlertedFood, " +
            "sum(case when is_eaten = false and in_trash = false and deleted = false then 1 else 0 end) as allActiveFood, " +
            "sum(case when is_eaten = true then 1 else 0 end) as allEatenFood, " +
            "sum(case when in_trash = true then 1 else 0 end) as allInTrash, " +
            "sum(case when deleted = true then 1 else 0 end) as allDeleted " +
            "FROM food " +
            "WHERE storage_id = :storageId " +
            "group by storage_id;", nativeQuery = true)
    IStorageStatisticActualInfo getStorageStatisticActualInfo(@Param("storageId") Long storageId);


    List<IStorageStatisticSimple> findAllByStorage_IdOrderByCreationDateDesc(Long storageId, Pageable pageable);



    @Query(value = "SELECT fc.name as categoryName, " +
            "sum(case when added_date between :startDate and :endDate then 1 else 0 end) as added, " +
            "sum(case when is_eaten = true AND processed_date between :startDate AND :endDate then 1 else 0 end) as eaten, " +
            "sum(case when in_trash = true AND processed_date between :startDate AND :endDate then 1 else 0 end) as inTrash, " +
            "sum(case when deleted = true AND processed_date between :startDate AND :endDate then 1 else 0 end) as deleted, " +
            "sum(case when in_trash = true AND processed_date between :startDate AND :endDate and processed_date > expiration_date then 1 else 0 end) as wasted, " +
            "sum(case when is_eaten = true AND processed_date between :startDate AND :endDate and processed_date > expiration_date then 1 else 0 end) as eatenAfter " +
            "FROM food " +
            "left outer join food_category fc on fc.id = food.food_id " +
            "where storage_id = :storageId " +
            "group by fc.id", nativeQuery = true)
    List<IStorageStatisticCategoryCount> getStorageStatisticCategoryCount(@Param("storageId") Long storageId, @Param("startDate") Date startDate,
                                                                          @Param("endDate") Date endDate);

}
