package com.bkopysc.foodstash.dto.users;

import com.bkopysc.foodstash.domain.EGender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor

public class UserRegisterDto {

//    @NotBlank
//    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(max = 50)
    private String password;

    @NotBlank
    @Size(max = 120)
    private String name;

    @NotBlank
    @Size(max = 120)
    private String surname;

    private Date birthDate;

    private EGender gender;



}
