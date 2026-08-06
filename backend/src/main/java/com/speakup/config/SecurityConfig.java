package com.speakup.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.speakup.security.JwtFilter;
import com.speakup.security.OAuth2LoginSuccessHandler;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final OAuth2LoginSuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(JwtFilter jwtFilter, OAuth2LoginSuccessHandler oAuth2SuccessHandler) {
        this.jwtFilter = jwtFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.IF_REQUIRED
                    )
            )

            .authorizeHttpRequests(auth -> auth

                    // PUBLIC ENDPOINTS
                    .requestMatchers(
                            "/api/auth/**",
                                "/audio/**",
                                "/oauth2/**",
                                "/login/**",
                                "/api/debug/**"
                    ).permitAll()
                    
                    // STUDENT route
                    .requestMatchers("/api/dashboard/**")
                    .hasAnyRole("STUDENT", "TEACHER", "ADMIN")

                    
                    // Teacher Routes
                    .requestMatchers("/api/teacher/**")
                    .hasAnyRole("TEACHER", "ADMIN")

                    

                    .requestMatchers("/api/admin/**")
                    .hasAnyRole("ADMIN")
                    
                    // EVERYTHING ELSE REQUIRES JWT
                    .anyRequest().authenticated()
            )

            .oauth2Login(oauth -> oauth
                .successHandler(oAuth2SuccessHandler)
        )

            .addFilterBefore(
                    jwtFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}