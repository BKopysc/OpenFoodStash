package com.bkopysc.foodstash.dto.foods;

import com.bkopysc.foodstash.domain.EUnitType;
import com.bkopysc.foodstash.dto.params.EFoodStatusParam;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FoodRequestParamDto {
    private boolean isEaten = false; //TODO: mapping error
    private Boolean isOpen = null;
    private boolean isAlerted = false;
    private boolean inTrash = false;
    private boolean deleted = false;
    private EFoodStatusParam foodStatus = EFoodStatusParam.ANY;
}
