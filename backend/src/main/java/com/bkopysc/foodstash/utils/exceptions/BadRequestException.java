package com.bkopysc.foodstash.utils.exceptions;

import lombok.Getter;

@Getter
public class BadRequestException extends RuntimeException{
    private final Object[] args;
    private final String messageName;

    private final String defaultNotFound = "default.error.notFound";

    public BadRequestException(){
        this.messageName = defaultNotFound;
        this.args = new Object[]{};
    }

    public BadRequestException(String messageName, Object[] args){
        super(messageName);
        this.messageName = messageName;
        this.args = args;
    }

    public BadRequestException(String messageName){
        super(messageName);
        this.messageName = messageName;
        this.args = new Object[]{};
    }
}
