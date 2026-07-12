package com.speakup.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.speakup.dto.CurrentUserDTO;
import com.speakup.dto.ForgotPasswordRequest;
import com.speakup.dto.ResetPasswordRequest;
import com.speakup.model.User;
import com.speakup.model.User.Role;
import com.speakup.repository.UserRepository;
import com.speakup.security.JwtUtil;
import com.speakup.security.RefreshToken;
import com.speakup.service.RefreshTokenService;
import com.speakup.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")


public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private RefreshTokenService refreshTokenService;
    
    @Autowired
    private JwtUtil JwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;


    // Registration and Login endpoints

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        
        try {
            // Check if email already exists
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already registered"));

            }
            // force STUDENT role
            user.setRole(Role.STUDENT);

            user.setPassword(
                passwordEncoder.encode(user.getPassword())
            );
            
            User savedUser = userRepository.save(user);

            return ResponseEntity.ok(savedUser);
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of("error", e.getMessage()));
        }
    }

    
  
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

            if (existingUser.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "User not found"));
            }

            User dbUser = existingUser.get();

           if (!passwordEncoder.matches(
                user.getPassword(),
                dbUser.getPassword()
           )) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid password"));
           } 
            // Hernerate JWT token
         String token = JwtUtil.generateToken(dbUser.getId(), dbUser.getEmail(), dbUser.getRole().name(), dbUser.getUsername() );

         RefreshToken refreshToken = refreshTokenService.createRefreshToken(dbUser);

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("refreshToken", refreshToken.getToken());

            response.put("username", dbUser.getUsername());
            response.put("email", dbUser.getEmail());
           response.put("role", dbUser.getRole().name());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/refresh")

    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {


        String refreshToken = request.get("refreshToken");


        RefreshToken token = refreshTokenService.verify(refreshToken);


        String newAccessToken = JwtUtil.generateToken(token.getUserId(), token.getEmail(), token.getRole(), token.getUsername());


        Map<String, String> response = new HashMap<>();

        response.put("accessToken", newAccessToken);


        return ResponseEntity.ok(response);


    }

    @PostMapping("/logout")

    public ResponseEntity<?> logoutUser(@RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");
    

        if (refreshToken != null) {

            refreshTokenService.logout(refreshToken);

        }
    

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));

    }


    @GetMapping("/current-user")
    public CurrentUserDTO getCurrentUserDTO(HttpServletRequest request ) {

        String userId = (String) request.getAttribute("userId");
        String username = (String) request.getAttribute("username");
        String role = (String) request.getAttribute("role");

        return CurrentUserDTO.builder()
        .id(userId)
        .username(username)
        .role(role)
        .build();
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();
       try{
        userService.generateResetToken(email);
       } catch(Exception ignored){
        // Ignore the exception to prevent email enumeration
       }
        return ResponseEntity.ok(Map.of("message", "If the email exists, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String resetToken = request.getResetToken();
        String newPassword = request.getNewPassword();
        try {
            userService.resetPassword(resetToken, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password reset successful"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

}