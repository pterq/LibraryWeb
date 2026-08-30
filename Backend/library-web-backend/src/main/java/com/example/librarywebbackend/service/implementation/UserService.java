package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.entity.User;
import com.example.librarywebbackend.repository.UserRepository;
import com.example.librarywebbackend.service.IUserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElse(null);
    }

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
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
                    return userRepository.save(user);
                })
                .orElse(null);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
