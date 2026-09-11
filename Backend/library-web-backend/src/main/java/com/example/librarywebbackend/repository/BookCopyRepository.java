package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.BookPhysical;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookCopyRepository extends JpaRepository<BookPhysical, Long> {

    BookPhysical findByInventoryCode(String inventoryCode);

    boolean existsByBook_Id(Long bookId);

    List<BookPhysical> findByBook_Id(Long bookId);

}
