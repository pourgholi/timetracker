package com.example.timetracker.repository;

import com.example.timetracker.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "projects")
public interface ProjectRepository extends JpaRepository<Project, Long> {}
