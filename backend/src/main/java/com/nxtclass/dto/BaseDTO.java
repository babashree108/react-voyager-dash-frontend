package com.nxtclass.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseDTO {

    private Long identifier;

    // Canonical JSON key: fName
    // Accepted aliases: firstName, fname, f_name
    @JsonProperty("fName")
    @JsonAlias({"firstName", "fname", "f_name"})
    private String fName;

    // Canonical JSON key: lName
    // Accepted aliases: lastName, lname, l_name
    @JsonProperty("lName")
    @JsonAlias({"lastName", "lname", "l_name"})
    private String lName;

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
