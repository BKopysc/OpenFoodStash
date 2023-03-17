package com.bkopysc.foodstash.utils.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthenticationFailedException extends RuntimeException {

    private final String message;
    private final int status;


}
