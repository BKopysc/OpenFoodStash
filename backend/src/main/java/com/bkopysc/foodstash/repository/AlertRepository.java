package com.bkopysc.foodstash.repository;

import com.bkopysc.foodstash.domain.Alert;
import com.bkopysc.foodstash.domain.Stash;
import com.bkopysc.foodstash.domain.Storage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    Optional<Alert> findByStorage(Storage storage);

    List<Alert> getAllByStorage_StashIn(Set<Stash> stasheSet);
}
