package com.bkopysc.foodstash.repository;

import com.bkopysc.foodstash.domain.User;
import com.bkopysc.foodstash.domain.UserPasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslPredicate;

import java.util.Optional;

public interface UserPasswordResetTokenRepository extends JpaRepository<UserPasswordResetToken, Long> {

    Optional<UserPasswordResetToken> findUserPasswordResetTokenByUser(User user);
    Optional<UserPasswordResetToken> findUserPasswordResetTokenByToken(String token);
}
