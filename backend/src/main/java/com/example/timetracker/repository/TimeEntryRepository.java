package com.example.timetracker.repository;

import com.example.timetracker.entity.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

@RepositoryRestResource(path = "time-entries")
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {

    @RestResource(path = "byUserAndDateBetween")
    java.util.List<TimeEntry> findByUserIdAndDateBetween(@Param("userId") Long userId, @Param("start") java.time.LocalDate start, @Param("end") java.time.LocalDate end);

    @Query("SELECT SUM(te.hours) FROM TimeEntry te WHERE te.project.id = :projectId")
    Double getTotalHoursForProject(@Param("projectId") Long projectId);

    @Query("SELECT SUM(te.hours) FROM TimeEntry te WHERE te.project.id = :projectId AND te.id <> :entryId")
    Double getTotalHoursForProjectExcludingEntry(@Param("projectId") Long projectId, @Param("entryId") Long entryId);
}
