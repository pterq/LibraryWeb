package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.LoginRequestDTO;
import com.example.librarywebbackend.dto.LoginResponseDTO;
import com.example.librarywebbackend.entity.FeeStatus;
import com.example.librarywebbackend.entity.User;
import com.example.librarywebbackend.entity.UserRole;
import com.example.librarywebbackend.repository.FeeRepository;
import com.example.librarywebbackend.repository.UserRepository;
import com.example.librarywebbackend.security.JwtService;
import com.example.librarywebbackend.security.JwtService.TokenData;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

class LoginServiceTest {

    @Test
    void loginReturnsJwtToken() {
        UserRepository userRepository = Mockito.mock(UserRepository.class);
        FeeRepository feeRepository = Mockito.mock(FeeRepository.class);
        PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
        JwtService jwtService = Mockito.mock(JwtService.class);

        LoginService loginService = new LoginService(userRepository, feeRepository, passwordEncoder, jwtService);

        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("jan@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setId(1L);
        user.setFirstName("Jan");
        user.setLastName("Kowalski");
        user.setEmail(request.getEmail());
        user.setPhone(null);
        user.setPasswordHash("encoded-password");
        user.setRole(UserRole.USER);

        when(userRepository.findByEmail(request.getEmail())).thenReturn(java.util.Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPasswordHash())).thenReturn(true);
        when(feeRepository.existsByUserIdAndStatus(user.getId(), FeeStatus.PENDING)).thenReturn(true);
        Instant tokenExpiresAt = Instant.parse("2026-09-06T16:57:13Z");
        when(jwtService.generateToken(user)).thenReturn(new TokenData("jwt-token", tokenExpiresAt));

        LoginResponseDTO response = loginService.login(request);

        assertNotNull(response);
        assertEquals(1L, response.getUserId());
        assertEquals(true, response.isHasFee());
        assertEquals("jwt-token", response.getAccessToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(tokenExpiresAt, response.getTokenExpiresAt());
    }
}
