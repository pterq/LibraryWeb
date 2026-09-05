package com.example.librarywebbackend.exception;

public class BookHasCopiesException extends RuntimeException {
    public BookHasCopiesException(String message) {
        super(message);
    }
}
