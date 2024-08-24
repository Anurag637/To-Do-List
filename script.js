document.addEventListener('DOMContentLoaded', loadTodos);

function addTodo() {
    const input = document.getElementById('todo-input');
    const priority = document.getElementById('priority-select').value;
    const dueDate = document.getElementById('due-date').value;
    const todoText = input.value.trim();

    if (todoText !== '') {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.priority = priority;
        li.dataset.dueDate = dueDate;
        li.innerHTML = `
            <input type="text" value="${todoText}" readonly>
            <span class="todo-info">Priority: ${priority} | Due: ${dueDate}</span>
            <button onclick="editTodo(this)">Edit</button>
            <button onclick="toggleComplete(this)">Complete</button>
            <button onclick="removeTodo(this)">Remove</button>
        `;
        document.getElementById('todo-list').appendChild(li);
        input.value = '';
        document.getElementById('priority-select').value = '';
        document.getElementById('due-date').value = '';
        saveTodos();
    }
}

function removeTodo(button) {
    const li = button.parentElement;
    li.remove();
    saveTodos();
}

function editTodo(button) {
    const li = button.parentElement;
    const input = li.querySelector('input');
    if (button.textContent === 'Edit') {
        button.textContent = 'Save';
        li.classList.add('editing');
        input.removeAttribute('readonly');
        input.focus();
    } else {
        button.textContent = 'Edit';
        li.classList.remove('editing');
        input.setAttribute('readonly', 'readonly');
        input.value = input.value.trim();
        const info = li.querySelector('.todo-info');
        const [priority, dueDate] = info.textContent.split(' | ').map(text => text.split(': ')[1]);
        li.dataset.priority = priority;
        li.dataset.dueDate = dueDate;
        saveTodos();
    }
}

function toggleComplete(button) {
    const li = button.parentElement;
    li.classList.toggle('completed');
    saveTodos();
}

function filterTasks(status) {
    const items = document.querySelectorAll('.todo-item');
    items.forEach(item => {
        switch (status) {
            case 'all':
                item.style.display = 'flex';
                break;
            case 'active':
                item.style.display = item.classList.contains('completed') ? 'none' : 'flex';
                break;
            case 'completed':
                item.style.display = item.classList.contains('completed') ? 'flex' : 'none';
                break;
        }
    });
}

function sortTasks(criterion) {
    const list = document.getElementById('todo-list');
    const items = Array.from(list.querySelectorAll('.todo-item'));

    items.sort((a, b) => {
        if (criterion === 'priority') {
            const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
            return priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority];
        } else if (criterion === 'date') {
            return new Date(a.dataset.dueDate) - new Date(b.dataset.dueDate);
        }
    });

    items.forEach(item => list.appendChild(item));
}

function saveTodos() {
    const todos = [];
    document.querySelectorAll('.todo-item').forEach(item => {
        todos.push({
            text: item.querySelector('input').value,
            completed: item.classList.contains('completed'),
            priority: item.dataset.priority,
            dueDate: item.dataset.dueDate
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.priority = todo.priority;
        li.dataset.dueDate = todo.dueDate;
        li.innerHTML = `
            <input type="text" value="${todo.text}" readonly>
            <span class="todo-info">Priority: ${todo.priority} | Due: ${todo.dueDate}</span>
            <button onclick="editTodo(this)">Edit</button>
            <button onclick="toggleComplete(this)">Complete</button>
            <button onclick="removeTodo(this)">Remove</button>
        `;
        if (todo.completed) {
            li.classList.add('completed');
        }
        document.getElementById('todo-list').appendChild(li);
    });
}
