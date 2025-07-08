package com.example.backend.Services;

import com.example.backend.Models.Task;
import com.example.backend.Models.UserPrincipal;
import com.example.backend.Models.Users;
import com.example.backend.Repositories.SubtaskRepo;
import com.example.backend.Repositories.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.StructuredTaskScope.Subtask;

@Service
public class SubtaskService {

    @Autowired
    SubtaskRepo repo;

    public void addTask(com.example.backend.Models.Subtask task, int taskID) {
        Users user = getCurrentUser();
        task.setUser(user);
        task.setParentTaskID(taskID);
        repo.save(task);
    }

    public List<com.example.backend.Models.Subtask> getAllSubtasks() {
        return repo.findAll();
    }

    public List<com.example.backend.Models.Subtask> getSubtasksforTask(int taskID) {
        Users user = getCurrentUser();
        return repo.findByParentTaskID(taskID);
    }

    public com.example.backend.Models.Subtask getSubtask(int subtaskID) {
        return repo.findById(subtaskID).orElse(null);
    }

    public void updateSubtask(com.example.backend.Models.Subtask task) {
        Users user = getCurrentUser();
        task.setUser(user);
        repo.save(task);
    }

    public void deleteSubtask(int subtaskID) {
        repo.deleteById(subtaskID);
    }

    private Users getCurrentUser() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userPrincipal.getUser();
    }
}
