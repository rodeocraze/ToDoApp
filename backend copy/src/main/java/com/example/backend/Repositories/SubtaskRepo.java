package com.example.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.Models.Subtask;
import com.example.backend.Models.Task;
import com.example.backend.Models.Users;

@Repository
public interface SubtaskRepo extends JpaRepository<Subtask, Integer> {

    @Query("SELECT s FROM Subtask s WHERE s.parentTaskID = :taskID")
    List<Subtask> findByParentTaskID(int taskID);
}
