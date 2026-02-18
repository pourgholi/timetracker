package com.example.timetracker.controller;

import com.example.timetracker.entity.TimeEntry;
import com.example.timetracker.repository.TimeEntryRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/overviews")
@SecurityRequirement(name = "bearerAuth")
public class OverviewController {

    @Autowired
    private TimeEntryRepository repository;

    @GetMapping("/weekly")
    public ResponseEntity<Map<LocalDate, Double>> getWeeklyOverview(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start) {
        LocalDate end = start.plusDays(6);
        List<TimeEntry> entries = repository.findByUserIdAndDateBetween(userId, start, end);
        Map<LocalDate, Double> dailyTotals = entries.stream()
                .collect(Collectors.groupingBy(TimeEntry::getDate, Collectors.summingDouble(TimeEntry::getHours)));
        return ResponseEntity.ok(dailyTotals);
    }

    @GetMapping("/monthly")
    public ResponseEntity<Double> getMonthlyOverview(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        List<TimeEntry> entries = repository.findByUserIdAndDateBetween(userId, start, end);
        double totalHours = entries.stream().mapToDouble(TimeEntry::getHours).sum();
        return ResponseEntity.ok(totalHours);
    }
}
