package com.example.timetracker.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double budgetHours = 0.0;

    private BigDecimal budgetCost = BigDecimal.ZERO;

    private BigDecimal hourlyRate;  // Optional, fallback to user rate
}
