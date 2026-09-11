package com.example.librarywebbackend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Getter
@Setter
@ConfigurationProperties(prefix = "")
public class LibraryProperties {

    private LateFees latefees = new LateFees();
    private int returnAfterDays;
    private int reservationExpiresAfterDays;
    private BigDecimal overdueFeePerDay;

    private String expireAtTime;
    private String loanDueAtTime;

    @Getter
    @Setter
    public static class LateFees {
        private String cron;
    }
}
