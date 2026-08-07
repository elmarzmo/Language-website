package com.speakup.security;

import java.io.IOException;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {


        
         
 
    

    
        String path = request.getServletPath();
        

System.out.println("JWT FILTER PATH: " + path);
System.out.println("AUTH HEADER: " + request.getHeader("Authorization"));

               if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        filterChain.doFilter(request, response);
        return;
    }



    if (path.equals("/api/auth/login")
        || path.equals("/api/auth/register")
        || path.startsWith("/oauth2/")
        || path.startsWith("/login/oauth2/")
        || path.startsWith("/login/")) {
            filterChain.doFilter(request, response);
            return;
}


        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        System.out.println("AUTH BEFORE: " 
    + SecurityContextHolder.getContext().getAuthentication());


        if (jwtUtil.isValid(token) ) {

            String userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);
            String username = jwtUtil.extractUsername(token);

 System.out.println("====== JWT DATA ======");
    System.out.println("USER ID: " + userId);
    System.out.println("USERNAME: " + username);
    System.out.println("ROLE: " + role);
    System.out.println("======================");




            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );

            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authToken);

            request.setAttribute("userId", userId);
            request.setAttribute("username", username);
            request.setAttribute("role", role);
            
        }

        filterChain.doFilter(request, response);
    }
}