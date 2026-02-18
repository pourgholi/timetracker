package com.example.timetracker.repository;

import com.example.timetracker.entity.Project;
import com.example.timetracker.entity.TimeEntry;
import com.example.timetracker.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class TimeEntryRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("timetracker_test")
            .withUsername("testuser")
            .withPassword("testpass");

    @Autowired
    private TimeEntryRepository timeEntryRepository;

    @Autowired
    private UserRepository userRepository;

    // Optional: if you need ProjectRepository in some tests
    @Autowired
    private ProjectRepository projectRepository;

    @Test
    void findByUserIdAndDateBetween_shouldReturnEntriesInDateRange() {
        // Arrange
        User user = new User();
        user.setUsername("testuser");
        user.setDefaultHourlyRate(BigDecimal.valueOf(50));
        user = userRepository.save(user);

        TimeEntry entry1 = new TimeEntry();
        entry1.setUser(user);
        entry1.setDate(LocalDate.now());
        entry1.setHours(8.0);
        timeEntryRepository.save(entry1);

        TimeEntry entry2 = new TimeEntry();
        entry2.setUser(user);
        entry2.setDate(LocalDate.now().minusDays(2));
        entry2.setHours(6.0);
        timeEntryRepository.save(entry2);

        // Act
        LocalDate start = LocalDate.now().minusDays(1);
        LocalDate end = LocalDate.now().plusDays(1);
        List<TimeEntry> result = timeEntryRepository.findByUserIdAndDateBetween(
                user.getId(), start, end);

        // Assert
        assertEquals(1, result.size());
        assertEquals(LocalDate.now(), result.get(0).getDate());
        assertEquals(8.0, result.get(0).getHours(), 0.001);
    }

    @Test
    void getTotalHoursForProject_shouldSumHoursCorrectly() {
        // Arrange
        User user = new User();
        user.setUsername("projectuser");
        user = userRepository.save(user);

        Project project = new Project();
        project.setName("Test Project");
        project.setBudgetHours(100.0);
        project.setBudgetCost(BigDecimal.valueOf(5000));
        // Assuming you have ProjectRepository - if not, add it or mock/stub
        project = projectRepository.save(project);

        TimeEntry entry1 = new TimeEntry();
        entry1.setUser(user);
        entry1.setProject(project);
        entry1.setDate(LocalDate.now());
        entry1.setHours(5.5);
        timeEntryRepository.save(entry1);

        TimeEntry entry2 = new TimeEntry();
        entry2.setUser(user);
        entry2.setProject(project);
        entry2.setDate(LocalDate.now().minusDays(1));
        entry2.setHours(3.25);
        timeEntryRepository.save(entry2);

        // Act
        Double total = timeEntryRepository.getTotalHoursForProject(project.getId());

        // Assert
        assertNotNull(total);
        assertEquals(8.75, total, 0.001);
    }

    @Test
    void getTotalHoursForProjectExcludingEntry_shouldExcludeGivenEntry() {
        // Arrange
        User user = new User();
        user.setUsername("excludeuser");
        user = userRepository.save(user);

        Project project = new Project();
        project.setName("Exclude Project");
        project = projectRepository.save(project); // if available

        TimeEntry entryToExclude = new TimeEntry();
        entryToExclude.setUser(user);
        entryToExclude.setProject(project);
        entryToExclude.setDate(LocalDate.now());
        entryToExclude.setHours(4.0);
        entryToExclude = timeEntryRepository.save(entryToExclude);

        TimeEntry otherEntry = new TimeEntry();
        otherEntry.setUser(user);
        otherEntry.setProject(project);
        otherEntry.setDate(LocalDate.now());
        otherEntry.setHours(7.0);
        timeEntryRepository.save(otherEntry);

        // Act
        Double totalExcluding = timeEntryRepository.getTotalHoursForProjectExcludingEntry(
                project.getId(), entryToExclude.getId());

        // Assert
        assertEquals(7.0, totalExcluding, 0.001);
    }

    @Test
    void findByUserIdAndDateBetween_withNoEntries_shouldReturnEmptyList() {
        User user = new User();
        user.setUsername("emptyuser");
        user = userRepository.save(user);

        List<TimeEntry> result = timeEntryRepository.findByUserIdAndDateBetween(
                user.getId(),
                LocalDate.now().minusDays(10),
                LocalDate.now().minusDays(5)
        );

        assertTrue(result.isEmpty());
    }
}