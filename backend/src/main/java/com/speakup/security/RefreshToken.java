package com.speakup.security;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "refresh_tokens")
public class RefreshToken {

    @Id
    private String id;
    private String userId;
    private String token;
    private String username;
    private String email;
    private String role;


    private LocalDateTime expiryDate;
    
}
