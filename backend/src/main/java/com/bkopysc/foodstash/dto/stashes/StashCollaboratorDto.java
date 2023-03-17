package com.bkopysc.foodstash.dto.stashes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StashCollaboratorDto {

    private String email;
    private boolean owner;
}
