package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.BookPhyscial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookCopyRepository extends JpaRepository<BookPhyscial, Long> {

    BookPhyscial findByInventoryCode(String inventoryCode);

    boolean existsByBook_Id(Long bookId);

    List<BookPhyscial> findByBook_Id(Long bookId);

}
