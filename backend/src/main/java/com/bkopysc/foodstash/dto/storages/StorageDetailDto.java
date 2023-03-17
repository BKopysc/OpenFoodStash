package com.bkopysc.foodstash.dto.storages;
import com.bkopysc.foodstash.domain.EStorageType;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StorageDetailDto {

    private Long id;
    private String name;
    private EStorageType storageType;
//    private Long stashId;
//    private String stashName;

}
