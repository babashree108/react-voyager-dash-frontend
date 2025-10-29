package com.nxtclass.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Course extends BaseDomain{

    private String course;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

}
