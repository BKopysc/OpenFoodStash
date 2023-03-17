package com.bkopysc.foodstash.dto.foods;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FoodConsumeDto {
    private Long id;
    private Double consumeAmount;
}
