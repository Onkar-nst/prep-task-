document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');

    // Fetch and render existing tasks
    function loadTasks() {
        fetch('/api/tasks')
            .then(res => res.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(renderTask);
            })
            .catch(err => console.error('Error fetching tasks:', err));
    }

    // Function to render a single task item
    function renderTask(task) {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');
        
        li.innerHTML = `
            <span class="task-title" onclick="toggleTask(${task.id}, ${task.completed})">${task.title}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
    }

    // Add a new task
    addBtn.addEventListener('click', () => {
        const title = taskInput.value.trim();
        if (!title) return alert("Task title can't be empty");

        fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        })
        .then(res => res.json())
        .then(newTask => {
            renderTask(newTask);
            taskInput.value = '';
        })
        .catch(err => console.error('Error adding task:', err));
    });

    // Delete a task (global function for onclick)
    window.deleteTask = function(id) {
        fetch(`/api/tasks/${id}`, { method: 'DELETE' })
            .then(() => loadTasks())
            .catch(err => console.error('Error deleting task:', err));
    };

    // Toggle task completion (global function for onclick)
    window.toggleTask = function(id, currentStatus) {
        fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !currentStatus })
        })
        .then(() => loadTasks())
        .catch(err => console.error('Error updating task:', err));
    };

    // Initial load
    loadTasks();
});
