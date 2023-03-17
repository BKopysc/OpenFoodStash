package com.bkopysc.foodstash.dto.storages;

import com.bkopysc.foodstash.domain.EStorageType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StorageStashDetailDto {
    private Long id;
    private String name;
    private EStorageType storageType;
    private String stashName;

}
