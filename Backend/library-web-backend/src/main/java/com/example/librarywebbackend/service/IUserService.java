package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.User.*;
import com.example.librarywebbackend.entity.User;


import java.util.List;

public interface IUserService {

    List<User> getAllUsers();

    User getUserByUserId(Long id);

    UserResponseDTO updateUserByUserId(Long id, UserRequestDTO dto);

    void deleteUserByUserId(Long id);

    RegisterResponseDTO createUser(RegisterRequestDTO request);

    LoginResponseDTO login(LoginRequestDTO request);
}
