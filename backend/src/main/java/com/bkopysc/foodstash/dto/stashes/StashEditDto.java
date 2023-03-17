package com.bkopysc.foodstash.dto.stashes;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StashEditDto {

    private String name;
    private boolean personal;
    //private Set<StashUserDto> usedByUsers;
}
