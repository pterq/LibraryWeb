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

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties({"book"})
    private BookPhyscial copy;

    private LocalDateTime reservedAt;
    private LocalDateTime expiresAt;

    private LocalDateTime loanDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;

    @Enumerated(EnumType.STRING)
    private LoanStatus status;
}
