package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.RegisterRequestDTO;
import com.example.librarywebbackend.dto.RegisterResponseDTO;

public interface IRegisterService {

    RegisterResponseDTO register(RegisterRequestDTO request);
}
