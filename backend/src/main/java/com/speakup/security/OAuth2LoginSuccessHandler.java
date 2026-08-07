package com.speakup.security;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.speakup.model.User;
import com.speakup.repository.UserRepository;
import com.speakup.service.RefreshTokenService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenservice;

     @Value("${frontend.url}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtUtil jwtUtil, RefreshTokenService refreshTokenservice) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.refreshTokenservice = refreshTokenservice;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
         HttpServletResponse response, 
         Authentication authentication) throws IOException, ServletException {

         
        OAuth2User googleUser = (OAuth2User) authentication.getPrincipal();


        String email = googleUser.getAttribute("email");
        String name = googleUser.getAttribute("name");

        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();

           
            if (name != null && !name.equals(user.getUsername())) {
                user.setUsername(name);
                userRepository.save(user);
            }
        } else {
            user = new User();
            user.setEmail(email);
            user.setUsername(name);
            user.setRole(User.Role.STUDENT);
            user.setAuthProvider(User.AuthProvider.GOOGLE);
            user = userRepository.save(user);
        }

        String accessToken = jwtUtil.generateToken(
            user.getId(),
            user.getEmail(),
            user.getRole().name(),
            user.getUsername()
        );
        String refreshToken = refreshTokenservice.createRefreshToken(user).getToken();

        // TODO: use the domain name before production
       String redirectUrl = frontendUrl 
        + "/oauth-success"
        + "?token=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8)
        + "&refreshToken=" + URLEncoder.encode(refreshToken, StandardCharsets.UTF_8);

response.sendRedirect(redirectUrl);
     
    }
    
    
}
