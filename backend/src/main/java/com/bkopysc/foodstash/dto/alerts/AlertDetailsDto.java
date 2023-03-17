package com.bkopysc.foodstash.dto.alerts;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class AlertDetailsDto {
    private Long id;
    private Long numberOfAlerts;
    private Date checkDate;
}
