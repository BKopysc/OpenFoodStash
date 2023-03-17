package com.bkopysc.foodstash.domain;

import com.bkopysc.foodstash.config.auditableConfig.Auditable;
import com.bkopysc.foodstash.utils.DateUtil;
import lombok.*;
import org.springframework.boot.context.properties.bind.DefaultValue;

import javax.persistence.*;
import java.util.Date;

@Builder
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserPasswordResetToken extends Auditable<Long> {

    private static final int EXPIRATION = 60 * 24;

    private static final DateUtil dateUtil = new DateUtil();

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    //private String email;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER, optional = true)
    @JoinColumn(nullable = false, name="user_id")
    private User user;

    private String token;

    private Date expiryDate;

    private boolean active;

    public void recalculateExpiryDate(){
        this.setExpiryDate(dateUtil.calculateExpiryDateForToken(EXPIRATION));
    }
}
