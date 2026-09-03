package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.Category;
import com.example.librarywebbackend.dto.CategoryWithCountDTO;

import java.util.List;

public interface ICategoryService {

    List<Category> getAllCategories();

    List<CategoryWithCountDTO> getCategoriesWithCount();

    Category getCategoryById(Long id);

    Category createCategory(Category category);

    Category updateCategory(Long id, Category updated);

    void deleteCategory(Long id);
}
