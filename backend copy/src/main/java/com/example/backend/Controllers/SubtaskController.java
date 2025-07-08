package com.example.backend.Controllers;

import com.example.backend.Models.Task;
import com.example.backend.Services.SubtaskService;
import com.example.backend.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.StructuredTaskScope.Subtask;

@RestController
@CrossOrigin
@RequestMapping("/main")
public class SubtaskController {

    @Autowired
    SubtaskService service;

    @PostMapping("/{taskID}/add/subtask")
    public ResponseEntity<String> addSubtask(@RequestBody com.example.backend.Models.Subtask task, @PathVariable int taskID) {
        service.addTask(task, taskID);
        return new ResponseEntity<>("Added task successfully", HttpStatus.OK);
    }

    @GetMapping("/subtasks")
    public ResponseEntity<List<com.example.backend.Models.Subtask>> getAllSubtasks() {
        List<com.example.backend.Models.Subtask> allSubs = service.getAllSubtasks();
        return new ResponseEntity<>(allSubs, HttpStatus.OK);
    }

    @GetMapping("/{taskID}/subtasks")
    public ResponseEntity<List<com.example.backend.Models.Subtask>> getSubtasksforTask(@PathVariable int taskID) {
        List<com.example.backend.Models.Subtask> allSubs = service.getSubtasksforTask(taskID);
        return new ResponseEntity<>(allSubs, HttpStatus.OK);
    }

    @GetMapping("/subtasks/{subtaskID}")
    public ResponseEntity<com.example.backend.Models.Subtask> getSubtask(@PathVariable int subtaskID) {
        com.example.backend.Models.Subtask task = service.getSubtask(subtaskID);
        if (task == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(task, HttpStatus.OK);
    }

    @PutMapping("/subtasks/update")
    public ResponseEntity<String> updateSubtask(@RequestBody com.example.backend.Models.Subtask task) {
        service.updateSubtask(task);
        return new ResponseEntity<>("Successfully updated task", HttpStatus.OK);
    }

    @DeleteMapping("/subtasks/{subtaskID}")
    public ResponseEntity<String> deleteTask(@PathVariable int subtaskID) {
        service.deleteSubtask(subtaskID);
        return new ResponseEntity<>("Deleted task", HttpStatus.OK);
    }
}