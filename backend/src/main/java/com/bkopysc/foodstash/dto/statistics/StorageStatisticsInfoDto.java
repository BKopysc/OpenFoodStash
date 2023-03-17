package com.bkopysc.foodstash.dto.statistics;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class StorageStatisticsInfoDto {
    private Long allActiveFood;
    private Long allAlertedFood;
    private Long allEatenFood;
    private Long allAddedFood;
    private Long allInTrash;
    private Long allDeleted;
}
