package com.example.librarywebbackend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BookHasCopiesException.class)
    public ResponseEntity<String> handleBookHasCopies(BookHasCopiesException ex) {
        return ResponseEntity.status(409).body(ex.getMessage());
    }

    @ExceptionHandler(DuplicateIsbnException.class)
    public ResponseEntity<String> handleDuplicateIsbn(DuplicateIsbnException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
