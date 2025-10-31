package com.nxtclass.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseDTO {

    private Long identifier;

    @JsonProperty("fName")
    @JsonAlias({"fname", "f_name", "firstName", "first_name"})
    private String fName;

    @JsonProperty("lName")
    @JsonAlias({"lname", "l_name", "lastName", "last_name"})
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
