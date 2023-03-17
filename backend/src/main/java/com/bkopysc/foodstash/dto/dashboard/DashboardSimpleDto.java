package com.bkopysc.foodstash.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSimpleDto {

    private String name;
    private int numOfStorages;
    private int numOfStashes;
    private long numOfAlerts;
    private long numOfActiveFood;
}
