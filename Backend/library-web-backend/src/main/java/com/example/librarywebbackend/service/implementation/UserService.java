package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.entity.User;
import com.example.librarywebbackend.entity.FeeStatus;
import com.example.librarywebbackend.repository.FeeRepository;
import com.example.librarywebbackend.repository.UserRepository;
import com.example.librarywebbackend.service.IUserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final FeeRepository feeRepository;

    public UserService(UserRepository userRepository, FeeRepository feeRepository) {
        this.userRepository = userRepository;
        this.feeRepository = feeRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::withFeeFlag)
                .toList();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::withFeeFlag)
                .orElse(null);
    }

    @Override
    public User createUser(User user) {
        return withFeeFlag(userRepository.save(user));
    }

    @Override
    public User updateUser(Long id, User updated) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstName(updated.getFirstName());
                    user.setLastName(updated.getLastName());
                    user.setEmail(updated.getEmail());
                    user.setPhone(updated.getPhone());
                    user.setRole(updated.getRole());
                    return withFeeFlag(userRepository.save(user));
                })
                .orElse(null);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private User withFeeFlag(User user) {
        user.setHasFee(feeRepository.existsByUserIdAndStatus(user.getId(), FeeStatus.PENDING));
        return user;
    }

}
