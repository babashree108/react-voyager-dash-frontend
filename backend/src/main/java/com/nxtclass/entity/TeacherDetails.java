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
    private String firstName;
    
    private String lastName;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "phone_no")
    private String phoneNo;
    
    @Column(name = "address1")
    private String address1;
    
    @Column(name = "address2")
    private String address2;
    
    @Column(name = "pincode")
    private String pincode;
    
    @Column(name = "state")
    private String state;
    
    @Column(name = "country")
    private String country;
    
    @Column(name = "adhar_no")
    private String adharNo;
}