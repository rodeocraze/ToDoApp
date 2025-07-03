package com.example.backend.Repositories;

import com.example.backend.Models.Task;
import com.example.backend.Models.Users;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepo extends JpaRepository<Task, Integer> {
    @Query("SELECT t FROM Task t WHERE t.user = :user")
    List<Task> findByUser(Users user);

    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.id = :taskID")
    Task findByUserAndId(Users user, int taskID);
}
