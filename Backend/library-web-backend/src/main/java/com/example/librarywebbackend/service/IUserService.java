package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.User;

import java.util.List;

public interface IUserService {

    List<User> getAllUsers();

    User getUserById(Long id);

    User createUser(User user);

    User updateUser(Long id, User user);

    void deleteUser(Long id);
}
