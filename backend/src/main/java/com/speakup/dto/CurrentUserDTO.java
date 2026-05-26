package com.speakup.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CurrentUserDTO {

    private String id;
    private String username;
    private String role;
    
    
}
