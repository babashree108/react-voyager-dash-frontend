package com.nxtclass.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class StudentDetails extends BaseDomain{

        @Column(name = "f_name")
        private String fName;

        @Column(name = "l_name")
        private String lName;

        @Column(name = "email")
        private String email;

        @Column(name = "phone_no")
        private String phoneNo;

        @Column(name = "grade")
        private String grade;

        @Column(name = "lecture")
        private String lecture;

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


