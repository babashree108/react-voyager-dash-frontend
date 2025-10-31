package com.nxtclass.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class GradeDTO extends BaseDTO{

    private String grade;
    private String description;
    private List<SectionDTO> sections;

}
