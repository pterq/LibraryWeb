package com.example.librarywebbackend.service.implementation;


import com.example.librarywebbackend.entity.Category;
import com.example.librarywebbackend.dto.CategoryWithCountDTO;
import com.example.librarywebbackend.repository.CategoryRepository;
import com.example.librarywebbackend.service.ICategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService implements ICategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public List<CategoryWithCountDTO> getCategoriesWithBookCounts() {
        return categoryRepository.findCategoriesWithCount();
    }

    @Override
    public Category getCategoryByCategoryId(Long id) {
        return categoryRepository.findById(id)
                .orElse(null);
    }

    @Override
    public Category createCategory(Category category) {
        String normalizedName = normalizeName(category.getName());
        if (categoryRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new IllegalStateException("Category with this name already exists.");
        }
        category.setName(normalizedName);
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategoryByCategoryId(Long id, Category updated) {
        return categoryRepository.findById(id)
                .map(category -> {
                    String normalizedName = normalizeName(updated.getName());
                    if (categoryRepository.existsByNameIgnoreCaseAndIdNot(normalizedName, id)) {
                        throw new IllegalStateException("Category with this name already exists.");
                    }
                    category.setName(normalizedName);
                    return categoryRepository.save(category);
                })
                .orElse(null);
    }

    @Override
    public void deleteCategoryByCategoryId(Long id) {
        categoryRepository.deleteById(id);
    }

    private String normalizeName(String name) {
        if (name == null) {
            throw new IllegalArgumentException("Category name is required.");
        }

        String normalizedName = name.trim();
        if (normalizedName.isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty.");
        }

        return normalizedName;
    }
}
