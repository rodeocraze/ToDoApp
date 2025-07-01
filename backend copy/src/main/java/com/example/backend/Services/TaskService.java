package com.example.backend.Services;

import com.example.backend.Models.Task;
import com.example.backend.Repositories.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    TaskRepo repo;

    public void addTask(Task task) {
        repo.save(task);
    }

    public List<Task> getTasks() {
        return repo.findAll();
    }

    public Task getTask(int taskID) {
        return repo.findById(taskID).orElse(null);
    }
}
