package com.bkopysc.foodstash.domain;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class FoodCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private boolean strongExpirationDate;

    @OneToMany(mappedBy = "foodCategory")
    private Set<Food> foodSet;


    public FoodCategory(String name, boolean strongExpirationDate) {
        this.name = name;
        this.strongExpirationDate = strongExpirationDate;
    }
}
