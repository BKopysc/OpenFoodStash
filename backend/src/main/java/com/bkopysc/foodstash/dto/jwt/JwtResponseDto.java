package com.bkopysc.foodstash.dto.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class JwtResponseDto {
    private String token;
    private String refreshToken;
    private final String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
}
