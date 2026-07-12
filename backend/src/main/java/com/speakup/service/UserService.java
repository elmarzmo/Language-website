package com.speakup.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.speakup.model.User;
import com.speakup.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String generateResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("If the email exists, a reset link has been sent."));

        // Generate a random token (you can use UUID or any other method)
        String resetToken = java.util.UUID.randomUUID().toString();

        // Set the token and its expiry time (e.g., 1 hour from now)
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15));

        // Save the updated user
        userRepository.save(user);

        return resetToken;
    }

    public void resetPassword(String resetToken, String newPassword) {
        User user = userRepository.findByResetToken(resetToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));

        // Check if the token has expired
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }

        // Update the user's password and clear the reset token and expiry
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password cannot be empty");
        }
        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        // Save the updated user
        userRepository.save(user);
    }



    public List<User> getAllStudents(){

        return userRepository.findByRole(User.Role.STUDENT);
    }

    public List<User> searchUnassignedStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of(); // Return empty list if query is null or empty
        }
        return userRepository.findTop10ByRoleAndUsernameContainingIgnoreCase(User.Role.STUDENT, query);
    }

    public List<User> getAllTeachers(){
        return userRepository.findByRole(User.Role.TEACHER);
    }

    public List<User> searchUnassignedTeachers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of(); // Return empty list if query is null or empty
        }
        return userRepository.findTop10ByRoleAndUsernameContainingIgnoreCase(User.Role.TEACHER, query);
    }
}
