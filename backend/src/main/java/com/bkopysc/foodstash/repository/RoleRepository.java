package com.bkopysc.foodstash.repository;

import com.bkopysc.foodstash.domain.ERole;
import com.bkopysc.foodstash.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
//    Optional<Role> findByName(ERole roleName);
    Optional<Role> findByName(ERole roleName);
}
