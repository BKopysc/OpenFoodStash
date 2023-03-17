package com.bkopysc.foodstash.service.auth;

import com.bkopysc.foodstash.dto.SimpleResponse;
import com.bkopysc.foodstash.dto.jwt.JwtResponseDto;
import com.bkopysc.foodstash.dto.users.*;
import org.springframework.security.core.Authentication;

public interface AuthService {

    SimpleResponse generateRegisterRequest(UserRegisterDto userRegisterDto);

    SimpleResponse passwordResetRequest(UserEmailActionDto emailActionDto );

    SimpleResponse passwordReset(UserPasswordResetDto userPasswordResetDto);
    SimpleResponse registerUser(String activationValue);
    SimpleResponse resendRegisterRequest(UserEmailActionDto registerResend);

    SimpleResponse checkPasswordResetToken(String resetValue);
    JwtResponseDto loginUser(UserLoginDto userLoginDto);

    UserInfoDto getUserInfo(Authentication authentication);

}
