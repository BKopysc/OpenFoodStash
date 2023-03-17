package com.bkopysc.foodstash.dto.stashes;

import com.bkopysc.foodstash.dto.storages.StorageComplexDto;
import com.bkopysc.foodstash.dto.storages.StorageDetailDto;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
public class StashDetailsDto {
    private Long id;
    private String name;
    private Long ownerId;
    private String ownerUsername;
    private boolean personal;
    private Set<StorageComplexDto> storages;
    private Integer numberOfStorages;
    private boolean hasWarning = false;
}
