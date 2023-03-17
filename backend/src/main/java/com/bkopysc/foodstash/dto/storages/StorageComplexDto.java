package com.bkopysc.foodstash.dto.storages;

import com.bkopysc.foodstash.domain.EStorageType;
import com.bkopysc.foodstash.dto.foods.FoodDetailsDto;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.Mapping;

import java.util.Set;

@Data
@NoArgsConstructor
public class StorageComplexDto {

    private Long id;
    private String name;
    private EStorageType storageType;
    private Long stashId;
    private String stashName;
    private String ownerUsername = "";
    private Long activeFoodStats = 0L;
    private Long alertsStats = 0L;

   // private Set<FoodDetailsDto> foodDetails;

}
