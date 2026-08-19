package com.taskflow.controller;

import com.taskflow.model.Task;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private static final Logger log = LoggerFactory.getLogger(TaskController.class);

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public Task createTask(@Valid @RequestBody Task task) {
        log.info("Received request to create task: title='{}', label='{}', dueDate={}, estimatedMinutes={}",
                task.getTitle(), task.getLabel(), task.getDueDate(), task.getEstimatedMinutes());

        Task saved = taskService.createTask(task);

        log.info("Task created successfully with id={}", saved.getId());
        return saved;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        log.info("Received request to fetch all tasks");
        List<Task> tasks = taskService.getAllTasks();
        log.info("Returning {} task(s)", tasks.size());
        return tasks;
    }

    @GetMapping("/{id}")
    public Task getTask(@PathVariable Long id) {
        log.info("Received request to fetch task with id={}", id);
        return taskService.getTaskById(id);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @Valid @RequestBody Task task) {
        log.info("Received request to update task id={}", id);
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        log.info("Received request to delete task id={}", id);
        taskService.deleteTask(id);
    }
}