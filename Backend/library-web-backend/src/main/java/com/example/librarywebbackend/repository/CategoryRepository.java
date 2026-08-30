package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}