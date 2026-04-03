const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure data folder and file exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
}

// Helper to read data
const readTasks = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

// Helper to write data
const writeTasks = (tasks) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

// --- CRUD ENDPOINTS ---

// GET: All tasks
app.get('/api/tasks', (req, res) => {
    try {
        const tasks = readTasks();
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Error reading tasks');
    }
});

// POST: Add new task
app.post('/api/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).send('Title is required');

    const tasks = readTasks();
    const newTask = {
        id: Date.now(),
        title,
        completed: false
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

// PUT: Update task (toggle complete)
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    
    let tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id == id);
    
    if (taskIndex === -1) return res.status(404).send('Task not found');
    
    // Update fields if provided
    if (title !== undefined) tasks[taskIndex].title = title;
    if (completed !== undefined) tasks[taskIndex].completed = completed;
    
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
});

// DELETE: Remove task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    let tasks = readTasks();
    const filteredTasks = tasks.filter(t => t.id != id);
    
    if (tasks.length === filteredTasks.length) {
        return res.status(404).send('Task not found');
    }
    
    writeTasks(filteredTasks);
    res.send('Task deleted');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
