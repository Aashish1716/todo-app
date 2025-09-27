const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simple storage (no database needed)
let tasks = [];
let taskId = 1;

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Todo API is working!', 
    endpoints: [
      'GET /tasks - Get all tasks',
      'POST /tasks - Create task',
      'PUT /tasks/:id - Update task',
      'DELETE /tasks/:id - Delete task'
    ]
  });
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json({ success: true, tasks, count: tasks.length });
});

// Create task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: taskId++,
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json({ success: true, task: newTask });
});

// Update task
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  res.json({ success: true, task: tasks[taskIndex] });
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.json({ success: true, message: 'Task deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Todo API running on http://localhost:${PORT}`);
});

module.exports = app;
