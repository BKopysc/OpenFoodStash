package com.bkopysc.foodstash.dto.storages;

import com.bkopysc.foodstash.domain.EStorageType;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Builder
public class StorageEditDto {

    private String name;
    private EStorageType storageType;
}
