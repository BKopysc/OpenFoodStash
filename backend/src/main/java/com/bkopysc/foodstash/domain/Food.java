package com.bkopysc.foodstash.domain;

import com.bkopysc.foodstash.config.auditableConfig.Auditable;
import lombok.*;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.Entity;
import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@SQLDelete(sql = "UPDATE food SET deleted = true WHERE id=?")
@FilterDef(name = "deletedFoodFilter", parameters = @ParamDef(name = "isDeleted", type = "boolean"))
@Filter(name = "deletedFoodFilter", condition = "deleted = :isDeleted")
public class Food extends Auditable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private EUnitType unitType;

    @Column(nullable = false)
    private Double initialUnitValue;


    @Column(nullable = false)
    private Double unitValue;

    @Column(nullable = false)
    private Date addedDate;

    @Column(nullable = true)
    private Date processedDate; // eat/trash/delete

    @Column(nullable = false)
    private Date expirationDate;

    //At one time there can only by eaten/trash/deleted
    private boolean isEaten;

    private boolean isOpen;

    private boolean inTrash;

    private double freshScore;

    private boolean isAlerted;

    private boolean deleted = Boolean.FALSE;

    @ManyToOne
    @JoinColumn(name="food_id", nullable = false)
    private FoodCategory foodCategory;

    @ManyToOne
    @JoinColumn(name="storage_id", nullable = false)
    private Storage storage;

}

