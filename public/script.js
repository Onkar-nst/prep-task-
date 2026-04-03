// Fetch tasks and render them
function loadTasks() {
    fetch('/tasks')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('taskList');
            list.innerHTML = ''; // clear current list
            
            data.forEach(task => {
                const item = document.createElement('div');
                item.style.marginBottom = '10px';
                
                const title = document.createElement('span');
                title.innerText = task.title + ' ';
                if (task.completed) {
                    title.style.textDecoration = 'line-through';
                }
                
                const toggleBtn = document.createElement('button');
                toggleBtn.innerText = 'Toggle';
                toggleBtn.onclick = () => toggleTask(task.id, task.completed);
                
                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = 'Delete';
                deleteBtn.onclick = () => deleteTask(task.id);
                
                item.appendChild(title);
                item.appendChild(toggleBtn);
                item.appendChild(deleteBtn);
                list.appendChild(item);
            });
        });
}

// Add a new task
function addTask() {
    const input = document.getElementById('taskInput');
    const title = input.value;
    
    if (!title) return;
    
    fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, completed: false })
    }).then(() => {
        input.value = '';
        loadTasks();
    });
}

// Toggle connection
function toggleTask(id, currentStatus) {
    fetch('/tasks/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
    }).then(() => {
        loadTasks();
    });
}

// Delete task
function deleteTask(id) {
    fetch('/tasks/' + id, {
        method: 'DELETE'
    }).then(() => {
        loadTasks();
    });
}

// Initial load
loadTasks();
