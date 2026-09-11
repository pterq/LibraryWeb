package com.example.librarywebbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "loans")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"book"})
    private BookPhysical copy;

    private LocalDateTime reservedAt;
    private LocalDateTime expiresAt;

    private LocalDateTime loanDate;
    private LocalDateTime dueDate;
    private LocalDateTime overdueAt;
    private LocalDateTime returnDate;


    @Enumerated(EnumType.STRING)
    private LoanStatus status;
}
