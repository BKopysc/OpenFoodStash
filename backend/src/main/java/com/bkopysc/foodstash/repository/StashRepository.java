package com.bkopysc.foodstash.repository;

import com.bkopysc.foodstash.domain.Stash;
import com.bkopysc.foodstash.domain.Storage;
import com.bkopysc.foodstash.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface StashRepository extends JpaRepository<Stash, Long> {

    List<Stash> findAllByUsedByUsers(User user);
    Stash findByStorages(Storage storage);

    //int countAllByUsedByUsers(Set<User> userSet);
}
