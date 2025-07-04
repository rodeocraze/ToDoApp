package com.example.backend.Services;

import com.example.backend.Models.Task;
import com.example.backend.Models.UserPrincipal;
import com.example.backend.Models.Users;
import com.example.backend.Repositories.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    TaskRepo repo;

    public void addTask(Task task) {
        Users user = getCurrentUser();
        task.setUser(user);
        repo.save(task);
    }

    public List<Task> getTasks() {
        Users user = getCurrentUser();
        return repo.findByUser(user);
    }

    public Task getTask(int taskID) {
        Users user = getCurrentUser();
        return repo.findByUserAndId(user, taskID);
    }

    public void updateTask(Task task) {
        Users user = getCurrentUser();
        task.setUser(user);
        repo.save(task);
    }

    public void deleteTask(int taskID) {
        repo.deleteById(taskID);
    }

    private Users getCurrentUser() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userPrincipal.getUser();
    }
}
