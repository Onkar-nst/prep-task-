const express = require('express');
const fs = require('fs');
const app = express();
const DATA_FILE = './data/tasks.json';

app.use(express.json());

// Root route to check connection
app.get('/', (req, res) => {
    res.send('CRUD API is running! Visit /tasks to see your data.');
});

// Get all
app.get('/tasks', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// Create
app.post('/tasks', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const newTask = { id: Date.now(), ...req.body };
  data.push(newTask);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json(newTask);
});

// Update (toggle etc)
app.put('/tasks/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  data = data.map(t => t.id == req.params.id ? { ...t, ...req.body } : t);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ status: 'ok' });
});

// Delete
app.delete('/tasks/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  data = data.filter(t => t.id != req.params.id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ status: 'deleted' });
});

app.listen(3000, () => console.log('Ready on port 3000'));
