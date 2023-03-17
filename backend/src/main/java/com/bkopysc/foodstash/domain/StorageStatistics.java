package com.bkopysc.foodstash.domain;


import com.bkopysc.foodstash.config.auditableConfig.Auditable;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.*;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@TypeDef(name="jsonb", typeClass = JsonBinaryType.class)
public class StorageStatistics extends Auditable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private Date startDate;

    @Column(nullable = false)
    private Date endDate;

    @Type(type = "jsonb")
    @Column(name="generatedData", columnDefinition = "jsonb")
    private StorageStatisticsGeneratedJson generatedData;

    @ManyToOne
    @JoinColumn(name="storage_id", nullable = false)
    private Storage storage;
}
