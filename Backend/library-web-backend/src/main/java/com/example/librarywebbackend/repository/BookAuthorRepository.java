package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.BookAuthor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import jakarta.transaction.Transactional;

public interface BookAuthorRepository extends JpaRepository<BookAuthor, Long> {

    @Transactional
    @Modifying
    @Query("DELETE FROM BookAuthor ba WHERE ba.book.id = :bookId")
    void deleteAllByBookId(Long bookId);

    @Query("SELECT COUNT(ba) FROM BookAuthor ba WHERE ba.author.id = :authorId")
    int countByAuthorId(Long authorId);

}
