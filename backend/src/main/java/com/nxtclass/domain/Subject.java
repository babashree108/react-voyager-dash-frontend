package com.nxtclass.domain;

import com.nxtclass.entity.BaseDomain;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "subjects")
public class Subject extends BaseDomain {
    
    private String subject;
}