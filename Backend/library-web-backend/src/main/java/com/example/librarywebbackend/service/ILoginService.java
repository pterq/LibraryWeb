package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.User.LoginRequestDTO;
import com.example.librarywebbackend.dto.User.LoginResponseDTO;

public interface ILoginService {

    LoginResponseDTO login(LoginRequestDTO request);
}
