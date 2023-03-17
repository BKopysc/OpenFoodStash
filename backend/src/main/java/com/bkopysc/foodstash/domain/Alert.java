package com.bkopysc.foodstash.domain;


import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "alert")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private Long numberOfAlerts = 0L;

    @Column(nullable = true)
    private Date checkDate = null;

    @OneToOne(mappedBy = "alert")
    private Storage storage;

}
