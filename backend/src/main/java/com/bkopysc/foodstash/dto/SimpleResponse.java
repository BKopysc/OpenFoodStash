package com.bkopysc.foodstash.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleResponse {
    private String message;
    private Long id;

    public SimpleResponse(String text){
        this.message = text;
        this.id = null;
    }

    public SimpleResponse(String text, Long id){
        this.message = text;
        this.id = id;
    }

    public SimpleResponse(Long id){
        this.message = "";
        this.id = id;
    }

}
