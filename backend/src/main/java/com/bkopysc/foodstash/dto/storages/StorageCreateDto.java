package com.bkopysc.foodstash.dto.storages;

import com.bkopysc.foodstash.domain.EStorageType;
import lombok.Data;


@Data
public class StorageCreateDto {
    private EStorageType storageType;
    private String name;
}

