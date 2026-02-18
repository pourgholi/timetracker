package com.example.timetracker.service;

import com.example.timetracker.entity.Project;
import com.example.timetracker.entity.TimeEntry;
import com.example.timetracker.entity.User;
import com.example.timetracker.repository.ProjectRepository;
import com.example.timetracker.repository.TimeEntryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.time.LocalDate;

@ExtendWith(MockitoExtension.class)
class TimeEntryServiceTest {

    @Mock
    private TimeEntryRepository timeEntryRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private TimeEntryService service;

    @Test
    void checkBudget_NoExceed() {
        TimeEntry entry = new TimeEntry();
        entry.setHours(5);
        Project project = new Project();
        project.setBudgetHours(10);
        project.setBudgetCost(BigDecimal.valueOf(100));
        project.setHourlyRate(BigDecimal.valueOf(10));
        entry.setProject(project);
        entry.setUser(new User());
        entry.getUser().setDefaultHourlyRate(BigDecimal.valueOf(10));

        org.mockito.Mockito.when(timeEntryRepository.getTotalHoursForProject(project.getId())).thenReturn(0.0);

        service.checkBudget(entry, false);  // No exception
    }

    @Test
    void checkBudget_ExceedHours() {
        TimeEntry entry = new TimeEntry();
        entry.setHours(6);
        Project project = new Project();
        project.setId(1L);
        project.setBudgetHours(10);
        entry.setProject(project);
        entry.setUser(new User());

        org.mockito.Mockito.when(timeEntryRepository.getTotalHoursForProject(1L)).thenReturn(5.0);

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class, () -> service.checkBudget(entry, false));
    }

    // Similar tests for cost exceed, update mode, null project
}
