package com.bkopysc.foodstash.utils.exceptions;

import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@JsonRootName("error")
@Getter
@Setter
public class ErrorResponse {

    private String message;
    private int errorStatus;
    private String timestamp = LocalDateTime.now().toString();
    private List<String> details;

    public ErrorResponse(int errorStatus, String message, List<String> details){
        super();
        this.message = message;
        this.details = details;
        this.errorStatus = errorStatus;
    }

    public ErrorResponse(int errorStatus, String message){
        super();
        this.message = message;
        this.details = Collections.emptyList();
        this.errorStatus = errorStatus;
    }
}
