package com.example.librarywebbackend;

import com.example.librarywebbackend.config.LibraryProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableConfigurationProperties(LibraryProperties.class)
@EnableScheduling
@SpringBootApplication
public class LibraryWebBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibraryWebBackendApplication.class, args);
    }

}
