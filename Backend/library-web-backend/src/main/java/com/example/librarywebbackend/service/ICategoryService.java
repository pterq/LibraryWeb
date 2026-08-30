package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.Category;

import java.util.List;

public interface ICategoryService {

    List<Category> getAllCategories();

    Category getCategoryById(Long id);

    Category createCategory(Category category);

    Category updateCategory(Long id, Category updated);

    void deleteCategory(Long id);
}
