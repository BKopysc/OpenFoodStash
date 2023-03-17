package com.bkopysc.foodstash.config.auditableConfig;

import com.bkopysc.foodstash.config.ApplicationContextProvider;
import com.bkopysc.foodstash.domain.User;
import com.bkopysc.foodstash.repository.UserRepository;
import com.bkopysc.foodstash.utils.exceptions.BadRequestException;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        //return Optional.of(0l) ;
        UserRepository userRepository = ApplicationContextProvider.getApplicationContext().getBean(UserRepository.class);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return Optional.of(auth.getName());
    }
}


