package com.bkopysc.foodstash.dto.refreshTokens;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@AllArgsConstructor
public class RefreshTokenRequestDto {

    @NotBlank
    private String refreshToken;

}
