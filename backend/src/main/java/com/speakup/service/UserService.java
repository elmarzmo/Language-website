package com.speakup.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.speakup.dto.LoginRequest;
import com.speakup.dto.RegisterRequest;
import com.speakup.dto.RegisterResponse;
import com.speakup.model.User;
import com.speakup.repository.UserRepository;
import com.speakup.security.JwtUtil;
import com.speakup.security.RefreshToken;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RefreshTokenService refreshTokenService, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
        this.jwtUtil = jwtUtil;
    }

    public RegisterResponse registerUser(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        //crete new user 
        User newUser = new User();
        newUser.setAuthProvider(User.AuthProvider.LOCAL);
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(User.Role.STUDENT); // Default role is STUDENT

        User savedUser = userRepository.save(newUser);
        
        RegisterResponse response = new RegisterResponse();

        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole().name());

        return response;
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

    public Map<String, String> loginUser(LoginRequest request) {

        User dbUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (dbUser.getAuthProvider() == User.AuthProvider.GOOGLE) {
            throw new IllegalArgumentException("This user has only signed up with Google. Please use Google login.");
        }

       

        if (!passwordEncoder.matches(request.getPassword(), dbUser.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(dbUser.getId(), dbUser.getEmail(), dbUser.getRole().name(), dbUser.getUsername());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(dbUser);

        Map<String, String> response = new HashMap<>();
        response.put("id", dbUser.getId());
        response.put("token", token);
        response.put("username", dbUser.getUsername());
        response.put("email", dbUser.getEmail());
        response.put("role", dbUser.getRole().name());
        response.put("refreshToken", refreshToken.getToken());

        return response;
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
