package com.bkopysc.foodstash.domain;

import com.bkopysc.foodstash.utils.DateUtil;
import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegistrationToken {

    private static final int EXPIRATION = 60 * 24;

    private static final DateUtil dateUtil = new DateUtil();

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String token;

    @OneToOne(mappedBy = "registrationToken")
    private UserRequest userRequest;

    private Date expiryDate = dateUtil.calculateExpiryDateForToken(EXPIRATION);

    public void recalculateExpiryDate(){
        this.setExpiryDate(dateUtil.calculateExpiryDateForToken(EXPIRATION));
    }

}
