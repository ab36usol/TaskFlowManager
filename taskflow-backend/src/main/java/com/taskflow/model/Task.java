package com.taskflow.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.Duration;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private LocalDate dueDate;

    // Stored as minutes in the DB, exposed as Duration in code
    private long estimatedMinutes;

    private String label; // e.g. "Work", "Personal", "Urgent"

    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.TODO;

    public Task() {}

    public Task(String title, LocalDate dueDate, long estimatedMinutes, String label) {
        this.title = title;
        this.dueDate = dueDate;
        this.estimatedMinutes = estimatedMinutes;
        this.label = label;
    }

    // Getters and setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public long getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(long estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
}