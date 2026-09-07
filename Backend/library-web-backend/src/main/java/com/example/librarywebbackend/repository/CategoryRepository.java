package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Category;
import com.example.librarywebbackend.dto.CategoryWithCountDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    @Query("""
    select new com.example.librarywebbackend.dto.CategoryWithCountDTO(
        c.id,
        c.name,
        coalesce(count(b.id), 0)
    )
    from Category c
    left join c.books b
    group by c.id, c.name
    order by c.name
""")
    List<CategoryWithCountDTO> findCategoriesWithCount();


}