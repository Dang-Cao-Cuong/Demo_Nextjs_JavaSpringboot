package com.demo.demo.Entity;

import com.demo.demo.Enums.MachineStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "cnc_machines")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SQLDelete(sql = "UPDATE cnc_machines SET deleted = true WHERE id = ?")
@SQLRestriction("is_deleted = false")
public class CncMachine extends BaseEntity {

    @Column(nullable = false)
    String name;
    @Column(nullable = false)
    String model;

    @Column(name = "manufacture_year")
    int manufactureYear;

    String location;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    MachineStatus status = MachineStatus.STOPPED;

    @Column(name = "is_deleted")
    @Builder.Default
    boolean isDeleted = false;
}
