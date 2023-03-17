package com.bkopysc.foodstash.repository;

import com.bkopysc.foodstash.domain.Stash;
import com.bkopysc.foodstash.domain.Storage;
import com.bkopysc.foodstash.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface StorageRepository extends JpaRepository<Storage, Long> {

    Set<Storage> findAllByStash(Stash stash);

    int countAllByStashIn(Set<Stash> usersStash);

}
