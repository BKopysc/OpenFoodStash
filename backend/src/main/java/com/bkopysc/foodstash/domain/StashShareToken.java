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
public class StashShareToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String token;

    @ManyToOne
    @JoinColumn(name = "owner_user_id")
    private User ownerUser;

    @ManyToOne
    @JoinColumn(name="invited_user_id")
    private User invitedUser;

    @ManyToOne
    @JoinColumn(name = "stash_id")
    private Stash stash;

    private boolean active;

    private boolean pending;

}
