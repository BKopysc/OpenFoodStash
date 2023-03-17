package com.bkopysc.foodstash.dto.stashes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StashShareDetailDto {

    private String email;
    private boolean pending;
}
