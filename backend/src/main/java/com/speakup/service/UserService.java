package com.speakup.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RefreshTokenService refreshTokenService, JwtUtil jwtUtil, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
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
        Optional<User> userOptional = userRepository.findByEmail(email);

        if(userOptional.isEmpty()) {
            return null;
        }


        User user = userOptional.get();

        // Generate a random token (you can use UUID or any other method)
        String rawToken = UUID.randomUUID().toString();

        
        String hashedToken = hashToken(rawToken);

        // Set the token and its expiry time (e.g., 1 hour from now)
        user.setResetToken(hashedToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));

        // Save the updated user
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), rawToken);

        return rawToken;
    }

    public void resetPassword(String rawResetToken, String newPassword) {

        if (rawResetToken == null || rawResetToken.isBlank()) {
            throw new IllegalArgumentException("Invalid reset token");
        }
        String hashedToken = hashToken(rawResetToken);

        User user = userRepository.findByResetToken(hashedToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));

        // Check if the token has expired
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }

        // Update the user's password and clear the reset token and expiry
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password cannot be empty");
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

    private String hashToken(String token) {
        try{
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
            // return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing token", e);
        }
        }
}
