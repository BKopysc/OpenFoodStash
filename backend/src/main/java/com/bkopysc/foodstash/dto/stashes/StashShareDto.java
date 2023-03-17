package com.bkopysc.foodstash.dto.stashes;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;

@Data
@NoArgsConstructor
public class StashShareDto {

    @Email
    String shareEmail;
}
