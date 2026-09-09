package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.User.RegisterRequestDTO;
import com.example.librarywebbackend.dto.User.RegisterResponseDTO;

public interface IRegisterService {

    RegisterResponseDTO register(RegisterRequestDTO request);
}
