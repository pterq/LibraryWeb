package com.example.librarywebbackend.mapper;

import com.example.librarywebbackend.dto.Author.AuthorDTO;
import com.example.librarywebbackend.dto.Book.BookResponseDTO;
import com.example.librarywebbackend.dto.BookPhysical.BookCopyResponseDTO;
import com.example.librarywebbackend.dto.Category.CategoryResponseDTO;
import com.example.librarywebbackend.dto.Loan.LoanResponseDTO;
import com.example.librarywebbackend.dto.User.UserResponseDTO;
import com.example.librarywebbackend.entity.Book;
import com.example.librarywebbackend.entity.BookPhysical;
import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class LoanMapper {

    public LoanResponseDTO toDto(Loan loan) {
        return new LoanResponseDTO(
                loan.getId(),
                toUserDto(loan.getUser()),
                toCopyDto(loan.getCopy()),
                loan.getStatus().name(),
                loan.getReservedAt(),
                loan.getExpiresAt(),
                loan.getLoanDate(),
                loan.getDueDate(),
                loan.getOverdueAt(),
                loan.getReturnDate()
        );
    }
    private UserResponseDTO toUserDto(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isHasFee()
        );
    }

    private BookCopyResponseDTO toCopyDto(BookPhysical copy) {
        return new BookCopyResponseDTO(
                copy.getId(),
                toBookDto(copy.getBook()),
                copy.getInventoryCode(),
                copy.getStatus().name()
        );
    }

    private BookResponseDTO toBookDto(Book book) {
        return new BookResponseDTO(
                book.getId(),
                book.getTitle(),
                book.getDescription(),
                book.getImageUrl(),
                book.getIsbn(),
                book.getPublishedYear(),
                book.getCategories()
                        .stream()
                        .map(cat -> new CategoryResponseDTO(cat.getId(), cat.getName()))
                        .toList(),
                book.getAuthors()
                        .stream()
                        .map(a -> new AuthorDTO(
                                a.getId(),
                                a.getFirstName(),
                                a.getLastName(),
                                a.getBiography()
                        ))
                        .toList()
        );
    }
}
