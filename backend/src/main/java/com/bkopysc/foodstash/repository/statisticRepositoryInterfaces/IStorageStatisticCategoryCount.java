package com.bkopysc.foodstash.repository.statisticRepositoryInterfaces;

import lombok.Data;
import lombok.NoArgsConstructor;


public interface IStorageStatisticCategoryCount {

    String getCategoryName();
    Long getAdded();
    Long getEaten();
    Long getInTrash();
    Long getDeleted();
    Long getWasted();
    Long getEatenAfter();
}
