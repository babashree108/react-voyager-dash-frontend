package com.nxtclass.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Grade extends BaseDomain{

    private String grade;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @JsonManagedReference
    @OneToMany(mappedBy = "grade", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Section> sections = new ArrayList<>();

}
