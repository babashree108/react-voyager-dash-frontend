package com.nxtclass.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseDTO {

    private Long identifier;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNo;

    private Long gradeIdentifier;
    
    private Long sectionIdentifier;

    private String lecture;

    private String address1;

    private String address2;

    private String pincode;

    private String state;

    private String country;

    private String adharNo;

}
