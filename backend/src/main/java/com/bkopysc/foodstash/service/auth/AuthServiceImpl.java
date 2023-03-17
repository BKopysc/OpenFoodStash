package com.bkopysc.foodstash.service.auth;

import com.bkopysc.foodstash.domain.*;
import com.bkopysc.foodstash.dto.SimpleResponse;
import com.bkopysc.foodstash.dto.jwt.JwtResponseDto;
import com.bkopysc.foodstash.dto.users.*;
import com.bkopysc.foodstash.repository.*;
import com.bkopysc.foodstash.service.mailing.EmailService;
import com.bkopysc.foodstash.service.users.UserService;
import com.bkopysc.foodstash.utils.HashUtil;
import com.bkopysc.foodstash.utils.RandomStringGenerator;
import com.bkopysc.foodstash.utils.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@RequiredArgsConstructor
@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final UserRequestRepository userRequestRepository;
    private final RegistrationTokenRepository registrationTokenRepository;
    private final UserPasswordResetTokenRepository userPasswordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final UserService userService;
    private final MessageSource messageSource;

    private final static HashUtil hashUtil = new HashUtil();

    private final static RandomStringGenerator randStrGen = new RandomStringGenerator();

    private final String roleError = "user.register.error.roleNotExists";

    private final String REGISTRATION_BODY = "mail.registration.body";
    private final String PASSWORD_RESET_BODY = "mail.resetPassword.body";
    private final String MAIL_FOOTER = "mail.footer";

    private final String REGISTRATION_SUBJECT = "mail.registration.subject";
    private final String PASSWORD_RESET_SUBJECT = "mail.resetPassword.subject";

    @Value("${foodstash.frontend.registrationUrl}") private String registrationUrl;
    @Value("${foodstash.frontend.passwordResetUrl}") private String passwordResetUrl;

    private final String USER_NOT_EXISTS = "user.auth.error.userNotExists";
    private final String ACCOUNT_ALREADY_CREATED = "user.auth.error.accountAlreadyCreated";
    private final String ACCOUNT_PENDING = "user.auth.error.accountPending";
    private final String PASSWORD_REQUEST_NOT_FOUND = "user.auth.error.passwordRequestNotFound";
    private final String EMAIL_NOT_FOUND = "user.auth.error.emailNotFound";
    private final String LINK_EXPIRED = "link.error.expired";
    private final String LINK_EXPIRED_AGAIN = "link.error.expiredAgain";
    private final String LINK_INVALID = "link.error.invalid";

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SimpleResponse generateRegisterRequest(UserRegisterDto userRegisterDto) {

        log.info("Creating profile request");

        if(userRepository.existsUserByEmail(userRegisterDto.getEmail())){
            throw new BadRequestException(ACCOUNT_ALREADY_CREATED);
        }

        if(userRequestRepository.existsByEmail(userRegisterDto.getEmail())){

            throw new BadRequestException(ACCOUNT_PENDING);
        }

        UserRequest userRequest = UserRequest.builder()
                .email(userRegisterDto.getEmail())
                .password(passwordEncoder.encode(userRegisterDto.getPassword()))
                .gender(userRegisterDto.getGender())
                .surname(userRegisterDto.getSurname())
                .name(userRegisterDto.getName())
                .birthDate(userRegisterDto.getBirthDate())
                .gender(userRegisterDto.getGender())
                .active(false)
                .build();

        RegistrationToken registrationToken = new RegistrationToken();
      
        registrationToken.setToken(randStrGen.getRandomUUID());
        registrationToken.setUserRequest(userRequest);
        userRequest.setRegistrationToken(registrationToken);

        userRequestRepository.save(userRequest);
        registrationTokenRepository.save(registrationToken);

        sendRegistrationToken(registrationToken, userRequest);

        return new SimpleResponse("Registration request send");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SimpleResponse passwordResetRequest(UserEmailActionDto emailActionDto) {
        log.info("Password reset request");
        String email = emailActionDto.getEmail();

        User user = userRepository.findByUsername(emailActionDto.getEmail())
                .orElseThrow(() -> new BadRequestException(USER_NOT_EXISTS));

        Optional<UserPasswordResetToken> _userPasswordResetToken = userPasswordResetTokenRepository
                .findUserPasswordResetTokenByUser(user);

        UserPasswordResetToken passwordResetToken = _userPasswordResetToken.orElseGet(UserPasswordResetToken::new);


        passwordResetToken.setToken(randStrGen.getRandomUUID());
        passwordResetToken.setUser(user);
        passwordResetToken.recalculateExpiryDate();
        passwordResetToken.setActive(true);

        userPasswordResetTokenRepository.save(passwordResetToken);
        sendPasswordResetEmail(passwordResetToken, user.getProfile().getName());
        return new SimpleResponse("Password reset send to email");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SimpleResponse passwordReset(UserPasswordResetDto passwordResetDto) {
        log.info("Password reset");

        UserPasswordResetToken passwordResetToken = userPasswordResetTokenRepository
                .findUserPasswordResetTokenByToken(passwordResetDto.getResetToken())
                .orElseThrow(()-> new BadRequestException(LINK_INVALID));

        if(passwordResetToken.getExpiryDate().before(new Date())){
            passwordResetToken.setActive(false);
            userPasswordResetTokenRepository.save(passwordResetToken);
            throw new BadRequestException(LINK_EXPIRED);
        } else if(!passwordResetToken.isActive()){
            throw new BadRequestException(LINK_EXPIRED);
        }


        User user = passwordResetToken.getUser();

        user.setPassword(passwordEncoder.encode(passwordResetDto.getNewPassword()));
        passwordResetToken.setActive(false);

        userRepository.save(user);
        userPasswordResetTokenRepository.save(passwordResetToken);

        return new SimpleResponse("Password was successfully changed");
    }

    private void sendPasswordResetEmail(UserPasswordResetToken userPasswordResetToken, String username){
        Locale locale = LocaleContextHolder.getLocale();
        Object[] msgArgs = new Object[] { username, passwordResetUrl + userPasswordResetToken.getToken() };
        EmailDetails emailDetails = EmailDetails.builder()
                .recipient(userPasswordResetToken.getUser().getEmail())
                .msgBody(messageSource.getMessage(PASSWORD_RESET_BODY,msgArgs,locale))
                .msgFooter(messageSource.getMessage(MAIL_FOOTER, null, locale))
                .subject(messageSource.getMessage(PASSWORD_RESET_SUBJECT, null, locale))
                .build();

        emailService.sendUserActionMail(emailDetails);
    }

    @Override
    public SimpleResponse checkPasswordResetToken(String resetValue){
        UserPasswordResetToken passwordResetToken = userPasswordResetTokenRepository
                .findUserPasswordResetTokenByToken(resetValue)
                .orElseThrow(()-> new BadRequestException(LINK_INVALID));

        if(passwordResetToken.getExpiryDate().before(new Date()) || !passwordResetToken.isActive()){
            throw new BadRequestException(LINK_EXPIRED);
        }

        return new SimpleResponse("valid");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SimpleResponse registerUser(String activationValue) {
        log.info("Verifying profile request");

        RegistrationToken token = registrationTokenRepository.findRegistrationTokenByToken(activationValue)
                .orElseThrow(()-> new BadRequestException(LINK_INVALID));

        UserRequest userRequest = token.getUserRequest();

        if(token.getExpiryDate().before(new Date())){

            token.setToken(randStrGen.getRandomUUID());
            token.recalculateExpiryDate();
            registrationTokenRepository.save(token);
            sendRegistrationToken(token, userRequest);
            throw new BadRequestException(LINK_EXPIRED_AGAIN);
        }

        Optional<Role> role = roleRepository.findByName(ERole.ROLE_USER);
        if(role.isEmpty()){
            throw new BadRequestException(roleError);
        }
        Role role1 = role.get();
        Set<Role> roleSet = new HashSet<>();
        roleSet.add(role1);

        User user = new User();
        user.setUsername(userRequest.getEmail());
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword()); //already encoded
        user.setRoles(roleSet);

        Profile profile = Profile.builder()
                .gender(userRequest.getGender())
                .surname(userRequest.getSurname())
                .name(userRequest.getName())
                .birthDate(userRequest.getBirthDate())
                .gender(userRequest.getGender())
                .build();

        profile.setUser(user);
        user.setProfile(profile);
        //userRequest.setActive(true);

        userRepository.save(user);
        profileRepository.save(profile);
        userRequestRepository.delete(userRequest);

        return new SimpleResponse("Successfully registered");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SimpleResponse resendRegisterRequest(UserEmailActionDto registerResend) {

        String userEmail = registerResend.getEmail();

        UserRequest request = userRequestRepository.findUserRequestByEmail(userEmail)
                .orElseThrow(()-> new BadRequestException(EMAIL_NOT_FOUND));

        RegistrationToken registrationToken = request.getRegistrationToken();
      
        registrationToken.setToken(randStrGen.getRandomUUID());
        registrationToken.recalculateExpiryDate();

        registrationTokenRepository.save(registrationToken);

        sendRegistrationToken(registrationToken, request);

        return new SimpleResponse("Registration request successfully resend");
    }

    private void sendRegistrationToken(RegistrationToken registrationToken, UserRequest userRequest){
        Locale locale = LocaleContextHolder.getLocale();
        Object[] msgArgs = new Object[] { userRequest.getName(),this.registrationUrl + registrationToken.getToken() };
        EmailDetails emailDetails = EmailDetails.builder()
                .recipient(userRequest.getEmail())
                .msgBody(messageSource.getMessage(REGISTRATION_BODY,msgArgs,locale))
                .msgFooter(messageSource.getMessage(MAIL_FOOTER, null, locale))
                .subject(messageSource.getMessage(REGISTRATION_SUBJECT, null, locale))
                .build();

        emailService.sendUserActionMail(emailDetails);
    }

    @Override
    public JwtResponseDto loginUser(UserLoginDto userLoginDto) {
        // login in /api/auth/login
        //CustomAuthenticationFilter.java

        return null;
    }

    @Override
    public UserInfoDto getUserInfo(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);

        UserInfoDto userInfoDto = new UserInfoDto();
        userInfoDto.setEmail(user.getEmail());
        userInfoDto.setName(user.getProfile().getName());
        userInfoDto.setSurname(user.getProfile().getSurname());

        return userInfoDto;
    }
}

