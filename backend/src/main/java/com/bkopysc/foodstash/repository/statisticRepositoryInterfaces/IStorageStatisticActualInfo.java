package com.bkopysc.foodstash.repository.statisticRepositoryInterfaces;

public interface IStorageStatisticActualInfo {

    Long getAllActiveFood();
    Long getAllEatenFood();
    Long getAllAlertedFood();
    Long getAllAddedFood();
    Long getAllInTrash();
    Long getAllDeleted();
}
