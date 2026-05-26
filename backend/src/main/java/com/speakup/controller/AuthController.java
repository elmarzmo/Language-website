package com.speakup.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.CurrentUserDTO;
import com.speakup.model.User;
import com.speakup.model.User.Role;
import com.speakup.repository.UserRepository;
import com.speakup.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")

public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
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
            user.setRole(Role.TEACHER);

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

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            
            response.put("username", dbUser.getUsername());
            response.put("email", dbUser.getEmail());
           response.put("role", dbUser.getRole().name());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/me")
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

}