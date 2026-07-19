package com.speakup.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;

    private String username;
    private String email;
    private String password;

    private Role role;

    public enum Role {
        STUDENT,
        TEACHER,
        ADMIN
    }

    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    private AuthProvider authProvider;

    public enum AuthProvider {
        LOCAL,
        GOOGLE
    }



    public User() {
    }

    public User(String username,
         String email, 
         String password, 
         Role role, 
         AuthProvider AuthProvider) {
            
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.authProvider = AuthProvider;
    }
    
}