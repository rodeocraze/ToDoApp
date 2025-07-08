package com.example.backend.Models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Subtask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;
    public int parentTaskID;
    
    private String title;
    
    @Column(name = "created_date")
    public LocalDate createdDate;
    public LocalDate startDate;
    public LocalDate dueDate;
    public LocalTime startTime;
    public LocalTime endTime;
    public String description;
    public String category;
    public boolean priority;
    public boolean completed;
    public boolean archived;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @PrePersist
    protected void onCreate() {
        if (createdDate == null) {
            createdDate = LocalDate.now();
        }
    }
}
