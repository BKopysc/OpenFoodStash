package com.bkopysc.foodstash.dto.stashes;


import com.bkopysc.foodstash.domain.Storage;
import com.bkopysc.foodstash.dto.storages.StorageCreateDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.util.Set;

@Data
public class StashCreateDto {

    private String name;
    private boolean personal;
    private Set<StorageCreateDto> storages;
}
