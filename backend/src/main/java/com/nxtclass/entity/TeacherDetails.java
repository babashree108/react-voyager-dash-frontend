package com.nxtclass.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TeacherDetails extends BaseDomain{
    @Column(name = "f_name")
    private String fName;
    @Column(name = "l_name")
    private String lName;
    private String email;
    private String phoneNo;
    private String address1;
    private String address2;
    private Long pincode;
    private String state;
    private String country;
    private String adharNo;
    private String gender;
}