package com.bkopysc.foodstash.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.bkopysc.foodstash.domain.User;
import com.bkopysc.foodstash.domain.UserPasswordResetToken;
import com.bkopysc.foodstash.dto.SimpleResponse;
import com.bkopysc.foodstash.dto.users.UserInfoDto;
import com.bkopysc.foodstash.dto.users.UserPasswordResetDto;
import com.bkopysc.foodstash.dto.users.UserRegisterDto;
import com.bkopysc.foodstash.dto.users.UserEmailActionDto;
import com.bkopysc.foodstash.security.SecurityUtils;
import com.bkopysc.foodstash.service.auth.AuthService;
import com.bkopysc.foodstash.service.users.UserService;
import com.bkopysc.foodstash.utils.exceptions.AuthenticationFailedException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.FORBIDDEN;

//package com.bkopysc.foodstash.controller;
//
//import com.bkopysc.foodstash.dto.refreshTokens.RefreshTokenRequestDto;
//import com.bkopysc.foodstash.dto.refreshTokens.RefreshTokenResponseDto;
//import com.bkopysc.foodstash.dto.users.UserLoginDto;
//import com.bkopysc.foodstash.dto.users.UserRegisterDto;
//import com.bkopysc.foodstash.service.auth.AuthService;
//import lombok.AllArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import javax.validation.Valid;
//
@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final SecurityUtils securityUtils = new SecurityUtils();


    @PostMapping("/register")
    public ResponseEntity<SimpleResponse> registerUser(@Valid @RequestBody UserRegisterDto registerDto){
        return ResponseEntity.ok().body(authService.generateRegisterRequest(registerDto));
    }

    @PostMapping("/password-reset-request")
    public ResponseEntity<SimpleResponse> passwordResetRequest(@Valid @RequestBody UserEmailActionDto emailActionDto){
        return ResponseEntity.ok(authService.passwordResetRequest(emailActionDto));
    }

    @PostMapping("/password-reset")
    public ResponseEntity<SimpleResponse> passwordReset(@Valid @RequestBody UserPasswordResetDto passwordResetDto){
        return ResponseEntity.ok(authService.passwordReset(passwordResetDto));
    }

    @GetMapping("/password-reset/check/{resetValue}")
    public ResponseEntity<SimpleResponse> passwordResetCheck(@PathVariable String resetValue){
        return ResponseEntity.ok(authService.checkPasswordResetToken(resetValue));
    }

    @PostMapping("/activate-account/{activationValue}")
    public ResponseEntity<SimpleResponse> activateAccount(@PathVariable String activationValue){
        return ResponseEntity.ok(authService.registerUser(activationValue));
    }

    @PostMapping("/resend-register-request")
    public ResponseEntity<SimpleResponse> resendRegisterRequest(@Valid @RequestBody UserEmailActionDto registerResend){
        return ResponseEntity.ok(authService.resendRegisterRequest(registerResend));
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user-info")
    public ResponseEntity<UserInfoDto> getUserInfo(Authentication authentication){
        return ResponseEntity.ok(authService.getUserInfo(authentication));
    }

    @GetMapping("/token/refresh")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authorizationHeader = request.getHeader("AuthorizationRefresh");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            try {
                String refreshToken = authorizationHeader.substring("Bearer ".length());
                Algorithm algorithm = Algorithm.HMAC256(securityUtils.jwtSecret.getBytes());
                JWTVerifier verifier = JWT.require(algorithm).build();
                DecodedJWT decodedJWT = verifier.verify(refreshToken);
                String username = decodedJWT.getSubject();
                User user = userService.getUser(username);

                String accessToken = JWT.create()
                        .withSubject(user.getUsername())
                        .withExpiresAt(new Date(System.currentTimeMillis() + securityUtils.tokenExpiryMs))
                        .withIssuer(request.getRequestURL().toString())
                        .withClaim("roles", user.getRoles().stream()
                                .map(role -> role.getName().toString()
                                )
                                .collect(Collectors.toList()))
                        .sign(algorithm);

                Map<String, String> tokens = new HashMap<>();
                tokens.put("access_token", accessToken);
                tokens.put("refresh_token", refreshToken);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                new ObjectMapper().writeValue(response.getOutputStream(), tokens);
            } catch (Exception exception) {
                throw new AuthenticationFailedException(exception.getMessage(), FORBIDDEN.value());
//                response.setHeader("error", exception.getMessage());
//                response.setStatus(UNAUTHORIZED.value());
//                Map<String, String> error = new HashMap<>();
//                error.put("message", exception.getMessage());
//                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
//                new ObjectMapper().writeValue(response.getOutputStream(), error);
            }
        } else {
            throw new RuntimeException("Refresh token is missing");
        }
    }

}
