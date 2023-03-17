package com.bkopysc.foodstash.domain;

import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldNameConstants
public class StorageStatisticsGeneratedJson implements Serializable {

    private String name;
    private Date startDate;
    private Date endDate;
    private String storageName;

//    //charts for food
//    private long numberOfAdded;
//    private long numberOfEaten;
//    private long numberOfMovedToTrash;
//    private long numberOfDeleted;
//    private long numberOfWasted; //moved to trash after expired
//    private long numberOfEatenAfterExpired;

    private Map<EStatisticFoodAction, Long> foodActionsStats;

    private Map<String, Long> numberOfAddedByCategory;
    private Map<String, Long> numberOfMovedToTrashByCategory;
    private Map<String, Long> numberOfEatenByCategory;
    private Map<String, Long> numberOfWastedByCategory;
    private Map<String, Long> numberOfEatenAfterExpiredByCategory;

    private Map<String, Long> mostFreqAddedCategory;
    private Map<String, Long> mostFreqMoveToTrashCategory;
    private Map<String, Long> mostFreqEatenCategory;
    private Map<String, Long> mostFreqWastedCategory;
    private Map<String, Long> mostFreqEatenAfterExpiredCategory;
    private Map<EStatisticFoodAction, Long> mostFreqFoodActions;

    private EStatisticTipOpinion tipOpinion;


}
