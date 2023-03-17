package com.bkopysc.foodstash.utils.exceptions;

import org.springframework.context.MessageSource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.*;
import static org.springframework.http.HttpStatus.FORBIDDEN;

@RestControllerAdvice
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler {
    private final MessageSource messageSource;

    public ResponseExceptionHandler(MessageSource messageSource){
        this.messageSource = messageSource;
    }

    @ExceptionHandler({BadRequestException.class})
    protected ResponseEntity handleBadRequestException(BadRequestException exception, Locale locale){
        String messageName = exception.getMessageName();
        Object[] args = exception.getArgs();

        String message = messageSource.getMessage(messageName, args, locale);
        ErrorResponse error = new ErrorResponse(400, message);

        return new ResponseEntity(error, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler({UsernameNotFoundException.class})
    protected ResponseEntity handleUsernameNotFoundException(UsernameNotFoundException exception){
        ErrorResponse errorResponse = new ErrorResponse(400, "not found");
        return new ResponseEntity(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({AuthFailedException.class})
    protected ResponseEntity handleAuthFailedException(AuthFailedException exception, Locale locale){
        String messageName = exception.getMessageName();
        ErrorResponse errorResponse = new ErrorResponse(FORBIDDEN.value(), messageName + " LOL ");
        return new ResponseEntity(errorResponse, FORBIDDEN);
    }

    @ExceptionHandler({AuthenticationFailedException.class})
    protected ResponseEntity handleAuthenticationFailedException(AuthenticationFailedException exception,Locale locale){
        String messageName = exception.getMessage();
        ErrorResponse errorResponse = new ErrorResponse(exception.getStatus(), messageName);
        return new ResponseEntity(errorResponse, HttpStatus.valueOf(exception.getStatus()));
    }


    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        List<String> details = new ArrayList<>();

        for(FieldError error : ex.getBindingResult().getFieldErrors()) {
            String buildedMsg = error.getField() + ":" + " '" + error.getRejectedValue()+ "' " + error.getDefaultMessage();
            details.add(buildedMsg);
        }

        ErrorResponse error = new ErrorResponse(400,"Validation Failed", details);
        return new ResponseEntity(error, HttpStatus.BAD_REQUEST);
    }
}
