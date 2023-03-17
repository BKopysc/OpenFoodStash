package com.bkopysc.foodstash.dto.statistics;

import com.bkopysc.foodstash.domain.StorageStatisticsGeneratedJson;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class StorageStatisticsDto {
    private Long id;
    private Date startDate;
    private Date endDate;
    private StorageStatisticsGeneratedJson generatedData;
}
