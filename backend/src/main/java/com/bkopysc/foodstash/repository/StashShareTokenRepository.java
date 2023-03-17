package com.bkopysc.foodstash.repository;

import com.bkopysc.foodstash.domain.Stash;
import com.bkopysc.foodstash.domain.StashShareToken;
import com.bkopysc.foodstash.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StashShareTokenRepository extends JpaRepository<StashShareToken, Long> {

    Optional<StashShareToken> findStashShareTokenByToken(String tokenValue);

    Optional<StashShareToken> findByInvitedUserAndStash(User invitedUser, Stash stash);
    List<StashShareToken> findAllByStashAndPendingIsTrueAndActiveIsTrue(Stash stash);
}
