package com.bkopysc.foodstash.security.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.bkopysc.foodstash.dto.users.UserLoginDto;
import com.bkopysc.foodstash.security.SecurityUtils;
import com.bkopysc.foodstash.utils.exceptions.AuthFailedException;
import com.bkopysc.foodstash.utils.exceptions.BadRequestException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.validation.SmartValidator;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final SecurityUtils securityUtils = new SecurityUtils();
    private final AuthenticationManager authenticationManager;


    public CustomAuthenticationFilter(AuthenticationManager authenticationManager){
        this.authenticationManager = authenticationManager;
    }
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String username = request.getParameter("email");
        String password = request.getParameter("password");
        UserLoginDto userLoginDto = new UserLoginDto().builder()
                .email(request.getParameter("email"))
                .password(request.getParameter("password"))
                .build();

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username,password);
        return authenticationManager.authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        User user = (User) authentication.getPrincipal();
        Algorithm algorithm = Algorithm.HMAC256(securityUtils.jwtSecret.getBytes());
        Date accessExpiryAt = new Date(System.currentTimeMillis() + securityUtils.tokenExpiryMs);
        String accessToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(accessExpiryAt)
                .withIssuer(request.getRequestURL().toString())
                .withClaim("roles", user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .sign(algorithm);

        Date refreshExpiryDate = new Date(System.currentTimeMillis() + securityUtils.refreshTokenExpiryMs);

        String refreshToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(refreshExpiryDate)
                .withIssuer(request.getRequestURL().toString())
                .sign(algorithm);
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("access_token", accessToken);
        responseBody.put("refresh_token", refreshToken);
        responseBody.put("username", user.getUsername());
        responseBody.put("expires_at", refreshExpiryDate);
        List<String> roles = user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        responseBody.put("roles", roles);

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(), responseBody);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        throw failed;
    }
}
