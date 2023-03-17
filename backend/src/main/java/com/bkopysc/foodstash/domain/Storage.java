package com.bkopysc.foodstash.domain;

import com.bkopysc.foodstash.config.auditableConfig.Auditable;
import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "storage")
public class Storage extends Auditable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(length = 80, nullable = false)
    private String name;

    @ManyToOne()
    @JoinColumn(name="stash_id", nullable = false)
    private Stash stash;

    @OneToMany(mappedBy = "storage")
    private Set<Food> foodSet;

    @Column(nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private EStorageType storageType;

    @OneToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name="alert_id", referencedColumnName = "id")
    private Alert alert;

    @OneToMany(mappedBy = "storage")
    private Set<StorageStatistics> storageStatistics;
}


