package com.bkopysc.foodstash.domain;

import com.bkopysc.foodstash.config.auditableConfig.Auditable;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Builder
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(length = 120, nullable = false)
    private String name;

    @Column(length = 120, nullable = false)
    private String surname;

    @Column(nullable = false)
    private Date birthDate;

    @Column(length = 10, nullable = false)
    private EGender gender;

    @OneToOne(mappedBy = "profile")
    private User user;

}

