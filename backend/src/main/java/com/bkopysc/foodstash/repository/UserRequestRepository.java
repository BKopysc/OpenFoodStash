package com.bkopysc.foodstash.repository;

import com.bkopysc.foodstash.domain.UserRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRequestRepository extends JpaRepository<UserRequest, Long> {

    boolean existsByEmail(String email);

    Optional<UserRequest> findUserRequestByEmail(String email);

}
