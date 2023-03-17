package com.bkopysc.foodstash.security;

import lombok.Getter;


public class SecurityUtils {
     public final String jwtSecret = "qwertqwertqwe123456"; // JWT SECRET
     public final Long tokenExpiryMs = 10 * 60 * 1000l; // 10 min
     public final Long refreshTokenExpiryMs = 6000 * 60 * 1000l; //6000 min
}
