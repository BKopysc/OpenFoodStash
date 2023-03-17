package com.bkopysc.foodstash.dto.statistics;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class StorageStatisticsSimpleDto {
    private Long id;
    private String storageName;
    private Date startDate;
    private Date endDate;
}
