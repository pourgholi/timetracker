package com.example.timetracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers  // ← Enables Testcontainers support
class TimeTrackerApplicationTests {

    @Container
    @ServiceConnection  // ← Auto-configures spring.datasource.* properties!
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("timetracker")
            .withUsername("user")
            .withPassword("pass");

    @Test
    void contextLoads() {
        // If we reach here → context loaded successfully (DB connected, dialect auto-detected)
    }
}