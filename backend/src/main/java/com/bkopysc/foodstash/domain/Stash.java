package com.bkopysc.foodstash.domain;

import com.bkopysc.foodstash.config.auditableConfig.Auditable;
import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "stash")
public class Stash extends Auditable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private Long ownerId;

    @Column(length = 30)
    private String name;

    private boolean personal;

    @ManyToMany(mappedBy = "userStashes")
    Set<User> usedByUsers = new HashSet<>();

    @OneToMany(mappedBy = "stash")
    private Set<Storage> storages = new HashSet<>();
}
