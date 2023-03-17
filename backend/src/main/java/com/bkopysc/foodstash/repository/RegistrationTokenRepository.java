package com.bkopysc.foodstash.repository;

import com.bkopysc.foodstash.domain.RegistrationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistrationTokenRepository extends JpaRepository<RegistrationToken, Long> {

    Optional<RegistrationToken> findRegistrationTokenByToken(String tokenValue);
}
