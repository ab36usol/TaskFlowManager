package com.taskflow.service;

import com.taskflow.model.Task;
import com.taskflow.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id " + id));
    }

    public Task updateTask(Long id, Task updated) {
        Task existing = getTaskById(id);
        existing.setTitle(updated.getTitle());
        existing.setDueDate(updated.getDueDate());
        existing.setEstimatedMinutes(updated.getEstimatedMinutes());
        existing.setLabel(updated.getLabel());
        existing.setStatus(updated.getStatus());
        return taskRepository.save(existing);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}