package com.bkopysc.foodstash.dto.statistics;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class StorageStatisticsPostDto {
    private Date startDate;
    private Date endDate;
}
