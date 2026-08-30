package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.RegisterRequestDTO;
import com.example.librarywebbackend.dto.RegisterResponseDTO;
import com.example.librarywebbackend.service.IRegisterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/register")
public class RegisterController {

    private final IRegisterService registerService;

    public RegisterController(IRegisterService registerService) {
        this.registerService = registerService;
    }

    @PostMapping
    public ResponseEntity<RegisterResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        RegisterResponseDTO response = registerService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
