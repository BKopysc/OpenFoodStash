package com.bkopysc.foodstash.dto.users;

import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserLoginDto {

    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}
