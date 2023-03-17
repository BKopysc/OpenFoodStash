package com.bkopysc.foodstash.repository.statisticRepositoryInterfaces;

import lombok.Data;
import lombok.NoArgsConstructor;

public interface IStorageStatisticCount {
     Long getStorageId();
     Long getAdded();
     Long getEaten();
     Long getInTrash();
     Long getDeleted();
     Long getWasted();
     Long getEatenAfter();
}
