package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.RegisterRequestDTO;
import com.example.librarywebbackend.dto.RegisterResponseDTO;
import com.example.librarywebbackend.entity.User;
import com.example.librarywebbackend.entity.UserRole;
import com.example.librarywebbackend.repository.UserRepository;
import com.example.librarywebbackend.security.JwtService;
import com.example.librarywebbackend.service.IRegisterService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RegisterService implements IRegisterService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public RegisterService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public RegisterResponseDTO register(RegisterRequestDTO request) {
        userRepository.findByEmail(request.getEmail())
                .ifPresent(user -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
                });

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);

        user = userRepository.save(user);
        String accessToken = jwtService.generateToken(user);

        return new RegisterResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt(),
                accessToken,
                "Bearer"
        );
    }
}
