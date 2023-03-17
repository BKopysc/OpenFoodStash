package com.bkopysc.foodstash.dto.refreshTokens;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RefreshTokenResponseDto {

    private String accessToken;
    private String refreshToken;
    private final String tokenType = "Bearer";
}
