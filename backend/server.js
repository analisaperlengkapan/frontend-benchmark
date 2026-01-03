const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory storage
let todos = [];
// Generate initial todos
for (let i = 0; i < 100; i++) {
  todos.push({
    id: i + 1,
    text: `Todo item ${i + 1}`,
    completed: i % 3 === 0
  });
}

// GET all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST new todo
app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const newTodo = {
    id: Date.now(),
    text,
    completed: false
  };
  todos.unshift(newTodo); // Add to beginning
  res.status(201).json(newTodo);
});

// PATCH update todo (toggle completion)
app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const todoIndex = todos.findIndex(t => t.id == id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (completed !== undefined) {
    todos[todoIndex].completed = completed;
  }

  res.json(todos[todoIndex]);
});

// DELETE todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex(t => t.id == id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const deletedTodo = todos[todoIndex];
  todos = todos.filter(t => t.id != id);

  res.json(deletedTodo);
});

// Reset for benchmarks
app.post('/reset', (req, res) => {
  todos = [];
  for (let i = 0; i < 100; i++) {
    todos.push({
      id: i + 1,
      text: `Todo item ${i + 1}`,
      completed: i % 3 === 0
    });
  }
  res.json({ message: 'Reset successful' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
