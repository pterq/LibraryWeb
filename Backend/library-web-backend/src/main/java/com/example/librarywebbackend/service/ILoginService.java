package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.LoginRequestDTO;
import com.example.librarywebbackend.dto.LoginResponseDTO;

public interface ILoginService {

    LoginResponseDTO login(LoginRequestDTO request);
}
