package com.speakup.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.speakup.model.User;
import com.speakup.repository.RefreshTokenRepository;
import com.speakup.security.RefreshToken;


@Service
public class RefreshTokenService {

    
    private final RefreshTokenRepository refreshTokenRepository;

    private final long REFRESH_TOKEN_DURATION_DAYS = 7;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }
    
    public RefreshToken createRefreshToken(User user) {

        refreshTokenRepository.deleteByUserId(user.getId());
        
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setUsername(user.getUsername());
        refreshToken.setEmail(user.getEmail());
        refreshToken.setRole(user.getRole().name());

        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(REFRESH_TOKEN_DURATION_DAYS));
        refreshToken.setToken(UUID.randomUUID().toString());
        return refreshTokenRepository.save(refreshToken);
    }


    public RefreshToken verify(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException("Refresh token has expired");
        }

        return refreshToken;
    }

    public void logout(String token) {
        
        refreshTokenRepository.findByToken(token).ifPresent(refreshToken ->
            {
                refreshTokenRepository.delete(refreshToken);
            }
        );
    }

    public void deleteByUserId(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }
}
