const express = require('express');
const fs = require('fs');
const app = express();
const DATA_FILE = './data/tasks.json';

app.use(express.json());
app.use(express.static('public'));

app.get('/tasks', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

app.post('/tasks', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const newTask = { id: Date.now(), ...req.body };
  data.push(newTask);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  data = data.map(t => t.id == req.params.id ? { ...t, ...req.body } : t);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ status: 'ok' });
});

app.delete('/tasks/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  data = data.filter(t => t.id != req.params.id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ status: 'deleted' });
});

app.listen(3000, () => console.log('Ready on port 3000'));
