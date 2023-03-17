package com.bkopysc.foodstash.dto.foods;


import com.bkopysc.foodstash.domain.EUnitType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class FoodCreateDto {

    private String name;
    private EUnitType unitType;
    private Double initialUnitValue;
    private Date expirationDate;
    private boolean isEaten;
    private boolean isOpen;
    //private boolean isUneatable;
    private double freshScore;
    private Long categoryId;
    private Long storageId;
}
