package com.bkopysc.foodstash.dto.foods;

import com.bkopysc.foodstash.domain.EUnitType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class FoodEditDto {
    private Long id;
    private String name;
    private EUnitType unitType;
    private Double initialUnitValue;
    private Double unitValue;
    private Date expirationDate;
    //private boolean isEaten;
    private boolean isOpen;
    //private double freshScore;
    private Long categoryId;
    private Long storageId;
}
