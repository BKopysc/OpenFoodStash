package com.bkopysc.foodstash.domain;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Builder
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 120, nullable = false)
    private String name;

    @Column(length = 120, nullable = false)
    private String surname;

    @Column(nullable = false)
    private Date birthDate;

    @Column(length = 10, nullable = false)
    private EGender gender;

    private boolean active;

    @OneToOne(cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JoinColumn(name="token_id", referencedColumnName = "id")
    private RegistrationToken registrationToken;

}
