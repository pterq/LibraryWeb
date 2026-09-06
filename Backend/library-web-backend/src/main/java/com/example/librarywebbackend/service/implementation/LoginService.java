package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.LoginRequestDTO;
import com.example.librarywebbackend.dto.LoginResponseDTO;
import com.example.librarywebbackend.entity.FeeStatus;
import com.example.librarywebbackend.entity.User;
import com.example.librarywebbackend.repository.FeeRepository;
import com.example.librarywebbackend.repository.UserRepository;
import com.example.librarywebbackend.security.JwtService;
import com.example.librarywebbackend.security.JwtService.TokenData;
import com.example.librarywebbackend.service.ILoginService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LoginService implements ILoginService {

    private final UserRepository userRepository;
    private final FeeRepository feeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginService(UserRepository userRepository, FeeRepository feeRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.feeRepository = feeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        TokenData tokenData = jwtService.generateToken(user);
        boolean hasFee = feeRepository.existsByUserIdAndStatus(user.getId(), FeeStatus.PENDING);
        user.setHasFee(hasFee);

        return new LoginResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                hasFee,
                tokenData.accessToken(),
                "Bearer",
                tokenData.tokenExpiresAt()
        );
    }
}
