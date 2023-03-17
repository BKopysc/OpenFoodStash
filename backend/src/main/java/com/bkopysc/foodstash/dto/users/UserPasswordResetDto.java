package com.bkopysc.foodstash.dto.users;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;

@Data
@NoArgsConstructor
public class UserPasswordResetDto {

    private String resetToken;
    private String newPassword;
}
