package com.example.backend.Controllers;

import com.example.backend.Models.Task;
import com.example.backend.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/main")
public class TaskController {

    @Autowired
    TaskService service;

    @PostMapping("/add")
    public ResponseEntity<String> addTask(@RequestBody Task task) {
        service.addTask(task);
        return new ResponseEntity<>("Added task successfully", HttpStatus.OK);
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getTasks() {
        List<Task> allTasks = service.getTasks();
        return new ResponseEntity<>(allTasks, HttpStatus.OK);
    }

    @GetMapping("/tasks/{taskID}")
    public ResponseEntity<Task> getTask(@PathVariable int taskID) {
        Task task = service.getTask(taskID);
        if (task == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(task, HttpStatus.OK);
    }

    @PutMapping("/tasks/update")
    public ResponseEntity<String> updateTask(@RequestBody Task task) {
        service.updateTask(task);
        return new ResponseEntity<>("Successfully updated task", HttpStatus.OK);
    }

    @DeleteMapping("/task/{taskID}")
    public ResponseEntity<String> deleteTask(@PathVariable int taskID) {
        service.deleteTask(taskID);
        return new ResponseEntity<>("Deleted task", HttpStatus.OK);
    }
}
