package com.bkopysc.foodstash.utils.exceptions;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.MessageSource;

@Getter
@Setter
public class AuthFailedException extends RuntimeException {

    private final String messageName;

    public AuthFailedException(String messageName){
        this.messageName = messageName;
    }
}
