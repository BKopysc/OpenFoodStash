package com.bkopysc.foodstash.repository;

import com.bkopysc.foodstash.domain.Profile;
import com.bkopysc.foodstash.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
