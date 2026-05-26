package com.speakup.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.speakup.security.JwtFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            .authorizeHttpRequests(auth -> auth

                    // PUBLIC ENDPOINTS
                    .requestMatchers(
                            "/api/auth/**"
                    ).permitAll()
                    
                    // STUDENT route
                    .requestMatchers("/api/dashboard/**")
                    .hasAnyRole("STUDENT", "TEACHER", "ADMIN")

                    
                    // Teacher Routes
                    .requestMatchers("/api/teachers/**")
                    .hasAnyRole("TEACHER", "ADMIN")

                    

                    .requestMatchers("/api/admin/**")
                    .hasAnyRole("ADMIN", "TEACHER")
                    
                    // EVERYTHING ELSE REQUIRES JWT
                    .anyRequest().authenticated()
            )

            .addFilterBefore(
                    jwtFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}