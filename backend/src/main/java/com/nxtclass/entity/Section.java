package com.nxtclass.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Section extends BaseDomain {

    private String name;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grade_id")
    @JsonBackReference
    private Grade grade;

}
