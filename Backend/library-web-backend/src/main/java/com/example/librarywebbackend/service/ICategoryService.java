package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.Category;
import com.example.librarywebbackend.dto.CategoryWithCountDTO;

import java.util.List;

public interface ICategoryService {

    List<Category> getAllCategories();

    List<CategoryWithCountDTO> getCategoriesWithBookCounts();

    Category getCategoryByCategoryId(Long id);

    Category createCategory(Category category);

    Category updateCategoryByCategoryId(Long id, Category updated);

    void deleteCategoryByCategoryId(Long id);
}
