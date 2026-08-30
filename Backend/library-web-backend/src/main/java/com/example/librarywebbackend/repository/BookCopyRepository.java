package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.BookCopy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {

    BookCopy findByInventoryCode(String inventoryCode);
}
