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

        private String email;

        private String phoneNo;

        private String grade;

        private String lecture;

        private String address1;

        private String address2;

        private Long pincode;

        private String state;

        private String country;

        private String adharNo;

        private String gender;
    }


