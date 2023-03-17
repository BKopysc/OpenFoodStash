package com.bkopysc.foodstash.dto.foodCategories;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FoodCategoryDetailsDto {
    private Long id;
    private String name;
    private boolean strongExpirationDate;
}
