package com.nxtclass.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class CourseDTO extends BaseDTO{

    private String course;
    private String description;
    private List<SectionDTO> sections;

}
