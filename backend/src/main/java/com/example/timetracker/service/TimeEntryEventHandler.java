package com.example.timetracker.handler;

import com.example.timetracker.entity.TimeEntry;
import com.example.timetracker.service.TimeEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.support.RepositoryEntityLinks;
import org.springframework.stereotype.Component;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;

@Component
@RepositoryEventHandler(TimeEntry.class)
public class TimeEntryEventHandler {

    @Autowired
    private TimeEntryService timeEntryService;

    @HandleBeforeCreate
    public void handleBeforeCreate(TimeEntry entry) {
        timeEntryService.checkBudget(entry, false);
    }

    @HandleBeforeSave
    public void handleBeforeSave(TimeEntry entry) {
        timeEntryService.checkBudget(entry, true);
    }
}
