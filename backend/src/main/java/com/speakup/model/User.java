package com.speakup.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
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



    public User() {
    }

    public User(String username, String email, String password, Role role, String resetToken, LocalDateTime resetTokenExpiry) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.resetToken = resetToken;
        this.resetTokenExpiry = resetTokenExpiry;
    }
    // Getters and Setters
    public String getId() {
        return id;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    
    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public LocalDateTime getResetTokenExpiry() {
        return resetTokenExpiry;
    }

    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {
        this.resetTokenExpiry = resetTokenExpiry;
    }

    
}