package com.bkopysc.foodstash.dto.foods;

import com.bkopysc.foodstash.domain.EFoodStatus;
import com.bkopysc.foodstash.domain.EUnitType;
import com.bkopysc.foodstash.dto.foodCategories.FoodCategoryDetailsDto;
import com.bkopysc.foodstash.dto.params.EFoodStatusParam;
import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
public class FoodDetailsDto {

    private Long id;
    private String name;
    private EUnitType unitType;
    private Double initialUnitValue;
    private Double unitValue;
    private Date addedDate;
    private Date expirationDate;
    private Date processedDate;
    private boolean isEaten;
    private boolean isOpen;
    //private boolean isUneatable;
    private double freshScore;
    private boolean isAlerted;
    private FoodCategoryDetailsDto foodCategoryDetailsDto;
    private EFoodStatus status;
    private Long storageId;
}
