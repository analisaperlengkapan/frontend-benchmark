<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List - Blade.php</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="todo-app" id="app">
        <div class="todo-header">
            <h1>Todo List</h1>
            <span class="framework-badge">Blade.php</span>
        </div>

        <div class="todo-input-container">
            <input
                type="text"
                class="todo-input"
                id="todo-input"
                placeholder="What needs to be done?"
                aria-label="New todo input"
            />
            <button 
                class="btn btn-primary" 
                onclick="addTodo()"
                aria-label="Add todo"
            >
                Add
            </button>
        </div>

        <div class="todo-filters">
            <button
                class="btn filter-btn active"
                onclick="setFilter('all')"
                data-filter="all"
                aria-label="Show all todos"
            >
                All
            </button>
            <button
                class="btn filter-btn"
                onclick="setFilter('active')"
                data-filter="active"
                aria-label="Show active todos"
            >
                Active
            </button>
            <button
                class="btn filter-btn"
                onclick="setFilter('completed')"
                data-filter="completed"
                aria-label="Show completed todos"
            >
                Completed
            </button>
        </div>

        <div class="todo-stats" id="todo-stats">
            <span id="remaining-count">0</span> items remaining
        </div>

        <ul class="todo-list" id="todo-list">
            <!-- Todos will be rendered here -->
        </ul>

        <div class="todo-footer">
            Frontend Benchmark - Blade.php Implementation
        </div>
    </div>

    <script>
        // Todo state
        let todos = [];
        let currentFilter = 'all';
        let nextId = 1;

        // Generate initial todos
        function generateInitialTodos(count) {
            const initialTodos = [];
            for (let i = 1; i <= count; i++) {
                initialTodos.push({
                    id: i,
                    text: `Todo item ${i}`,
                    completed: i % 3 === 0
                });
            }
            return initialTodos;
        }

        // Initialize todos
        function initTodos() {
            todos = generateInitialTodos(100);
            nextId = 101;
            render();
        }

        // Add new todo
        function addTodo() {
            const input = document.getElementById('todo-input');
            const text = input.value.trim();
            
            if (text === '') return;
            
            const newTodo = {
                id: nextId++,
                text: text,
                completed: false
            };
            
            todos.unshift(newTodo);
            input.value = '';
            render();
        }

        // Toggle todo completion
        function toggleTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                render();
            }
        }

        // Delete todo
        function deleteTodo(id) {
            todos = todos.filter(t => t.id !== id);
            render();
        }

        // Set filter
        function setFilter(filter) {
            currentFilter = filter;
            
            // Update button states
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === filter) {
                    btn.classList.add('active');
                }
            });
            
            render();
        }

        // Get filtered todos
        function getFilteredTodos() {
            switch (currentFilter) {
                case 'active':
                    return todos.filter(t => !t.completed);
                case 'completed':
                    return todos.filter(t => t.completed);
                default:
                    return todos;
            }
        }

        // Get remaining count
        function getRemainingCount() {
            return todos.filter(t => !t.completed).length;
        }

        // Render todos
        function render() {
            const filteredTodos = getFilteredTodos();
            const remainingCount = getRemainingCount();
            const todoList = document.getElementById('todo-list');
            const statsElement = document.getElementById('todo-stats');
            
            // Update stats
            statsElement.innerHTML = `<span id="remaining-count">${remainingCount}</span> ${remainingCount === 1 ? 'item' : 'items'} remaining`;
            
            // Render todos
            if (filteredTodos.length === 0) {
                todoList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <div class="empty-state-text">No todos to display</div>
                    </div>
                `;
            } else {
                todoList.innerHTML = filteredTodos.map(todo => `
                    <li class="todo-item ${todo.completed ? 'completed' : ''}">
                        <input
                            type="checkbox"
                            class="todo-checkbox"
                            ${todo.completed ? 'checked' : ''}
                            onchange="toggleTodo(${todo.id})"
                            aria-label="Toggle ${todo.text}"
                        />
                        <span class="todo-text">${escapeHtml(todo.text)}</span>
                        <button
                            class="btn btn-delete"
                            onclick="deleteTodo(${todo.id})"
                            aria-label="Delete ${todo.text}"
                        >
                            Delete
                        </button>
                    </li>
                `).join('');
            }
        }

        // Escape HTML to prevent XSS
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Handle Enter key
        document.addEventListener('DOMContentLoaded', function() {
            const input = document.getElementById('todo-input');
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTodo();
                }
            });
            
            // Initialize
            initTodos();
        });
    </script>
</body>
</html>
