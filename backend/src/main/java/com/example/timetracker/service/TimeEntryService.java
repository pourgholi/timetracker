package com.example.timetracker.service;

import com.example.timetracker.entity.Project;
import com.example.timetracker.entity.TimeEntry;
import com.example.timetracker.repository.ProjectRepository;
import com.example.timetracker.repository.TimeEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class TimeEntryService {

    @Autowired
    private TimeEntryRepository timeEntryRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public void checkBudget(TimeEntry entry, boolean isUpdate) {
        Project project = entry.getProject();
        if (project == null) return;

        Long entryId = isUpdate ? entry.getId() : null;
        double currentTotalHours = (entryId != null) 
            ? timeEntryRepository.getTotalHoursForProjectExcludingEntry(project.getId(), entryId) 
            : timeEntryRepository.getTotalHoursForProject(project.getId());

        double newTotalHours = currentTotalHours + entry.getHours();

        if (newTotalHours > project.getBudgetHours()) {
            throw new RuntimeException("Project hours budget exceeded");
        }

        BigDecimal rate = project.getHourlyRate() != null ? project.getHourlyRate() : entry.getUser().getDefaultHourlyRate();
        BigDecimal newTotalCost = BigDecimal.valueOf(newTotalHours).multiply(rate);

        if (newTotalCost.compareTo(project.getBudgetCost()) > 0) {
            throw new RuntimeException("Project cost budget exceeded");
        }
    }

    public BigDecimal calculateCost(TimeEntry entry) {
        BigDecimal rate = entry.getProject().getHourlyRate() != null ? entry.getProject().getHourlyRate() : entry.getUser().getDefaultHourlyRate();
        return BigDecimal.valueOf(entry.getHours()).multiply(rate);
    }
}
