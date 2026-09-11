package com.example.librarywebbackend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class PropertiesDebugger {

    private final LibraryProperties props;

    public PropertiesDebugger(LibraryProperties props) {
        this.props = props;
    }

    @PostConstruct
    public void debug() {
        System.out.println("=== LibraryProperties loaded ===");
        System.out.println("latefees.cron = " + props.getLatefees().getCron());
        System.out.println("returnAfterDays = " + props.getReturnAfterDays());
        System.out.println("reservationExpiresAfterDays = " + props.getReservationExpiresAfterDays());
        System.out.println("overdueFeePerDay = " + props.getOverdueFeePerDay());
        System.out.println("expireAtTime = " + props.getExpireAtTime());
        System.out.println("loanDueAtTime = " + props.getLoanDueAtTime());
    }
}
