package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.Loan.LoanResponseDTO;
import com.example.librarywebbackend.dto.User.*;
import com.example.librarywebbackend.entity.User;
import com.example.librarywebbackend.entity.FeeStatus;
import com.example.librarywebbackend.entity.UserRole;
import com.example.librarywebbackend.repository.FeeRepository;
import com.example.librarywebbackend.repository.LoanRepository;
import com.example.librarywebbackend.repository.UserRepository;
import com.example.librarywebbackend.security.JwtService;
import com.example.librarywebbackend.security.JwtService.TokenData;
import com.example.librarywebbackend.service.IUserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final FeeRepository feeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LoanRepository loanRepository;

    public UserService(UserRepository userRepository, FeeRepository feeRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService, LoanRepository loanRepository) {
        this.userRepository = userRepository;
        this.feeRepository = feeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.loanRepository = loanRepository;
    }

    // -------------------------
    //        USERS CRUD
    // -------------------------

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::withFeeFlag)
                .toList();
    }

    @Override
    public User getUserByUserId(Long id) {
        return userRepository.findById(id)
                .map(this::withFeeFlag)
                .orElse(null);
    }

    @Override
    public UserResponseDTO updateUserByUserId(Long id, UserRequestDTO dto) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstName(dto.getFirstName());
                    user.setLastName(dto.getLastName());
                    user.setEmail(dto.getEmail());
                    user.setPhone(dto.getPhone());
                    user.setRole(dto.getRole());

                    user = userRepository.save(user);

                    boolean hasFee = feeRepository.existsByUserIdAndStatus(user.getId(), FeeStatus.PENDING);
                    user.setHasFee(hasFee);

                    return new UserResponseDTO(
                            user.getId(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getEmail(),
                            user.getPhone(),
                            user.getRole(),
                            hasFee
                    );
                })
                .orElse(null);
    }




    @Override
    public void deleteUserByUserId(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        boolean hasFees = feeRepository.existsByUserId(id);
        boolean hasLoans = loanRepository.existsByUserId(id);

        if (hasFees || hasLoans) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete user with active loans or fees."
            );
        }

        userRepository.delete(user);
    }


    private User withFeeFlag(User user) {
        user.setHasFee(feeRepository.existsByUserIdAndStatus(user.getId(), FeeStatus.PENDING));
        return user;
    }

    // -------------------------
    //        CREATE USER
    // -------------------------

    @Override
    public RegisterResponseDTO createUser(RegisterRequestDTO request) {

        userRepository.findByEmail(request.getEmail())
                .ifPresent(u -> {
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

        TokenData tokenData = jwtService.generateToken(user);

        return new RegisterResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                false,
                tokenData.accessToken(),
                "Bearer",
                tokenData.tokenExpiresAt()
        );
    }

    // -------------------------
    //           LOGIN
    // -------------------------

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password")
                );

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        boolean hasFee = feeRepository.existsByUserIdAndStatus(user.getId(), FeeStatus.PENDING);
        user.setHasFee(hasFee);

        TokenData tokenData = jwtService.generateToken(user);

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

    @Override
    public void changePassword(Long id, PasswordRequestDTO dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
                );

        // sprawdzenie poprawności aktualnego hasła
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid current password");
        }

        try {
            user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
            userRepository.save(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to change password");
        }
    }


}
