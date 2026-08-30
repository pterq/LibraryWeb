package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.RegisterRequestDTO;
import com.example.librarywebbackend.dto.RegisterResponseDTO;
import com.example.librarywebbackend.entity.User;
import com.example.librarywebbackend.entity.UserRole;
import com.example.librarywebbackend.repository.UserRepository;
import com.example.librarywebbackend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class RegisterServiceTest {

    @Test
    void registerReturnsJwtToken() {
        UserRepository userRepository = Mockito.mock(UserRepository.class);
        PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
        JwtService jwtService = Mockito.mock(JwtService.class);

        RegisterService registerService = new RegisterService(userRepository, passwordEncoder, jwtService);

        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setFirstName("Jan");
        request.setLastName("Kowalski");
        request.setEmail("jan@example.com");
        request.setPassword("password123");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setFirstName(request.getFirstName());
        savedUser.setLastName(request.getLastName());
        savedUser.setEmail(request.getEmail());
        savedUser.setPhone(null);
        savedUser.setRole(UserRole.USER);
        savedUser.setCreatedAt(LocalDateTime.now());

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(savedUser)).thenReturn("jwt-token");

        RegisterResponseDTO response = registerService.register(request);

        assertNotNull(response);
        assertEquals(1L, response.getUserId());
        assertEquals("jwt-token", response.getAccessToken());
        assertEquals("Bearer", response.getTokenType());
    }
}
