package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeeRepository extends JpaRepository<Fee, Long> {
}
