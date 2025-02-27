import { TaskManager } from './TaskManager.js';

export class DOM {
    static init(taskManager) {
        this.taskManager = taskManager;
        this.setupEventListeners();
        this.renderFilteredTasks();
    }

    static setupEventListeners() {
        document.getElementById('newTaskBtn').addEventListener('click', () => this.toggleTaskInput());
        document.getElementById('cancelTask').addEventListener('click', () => this.cancelTask());
        document.getElementById('addTask').addEventListener('click', (e) => this.handleAddTask(e));
        document.getElementById('filter').addEventListener('change', () => this.renderFilteredTasks());
        document.getElementById('sort').addEventListener('change', () => this.renderFilteredTasks());
        
        document.getElementById('taskList').addEventListener('click', (e) => {
            const taskElement = e.target.closest('.task-item');
            if (!taskElement) return;

            const taskId = parseInt(taskElement.dataset.id);
            
            if (e.target.matches('input[type="checkbox"]')) {
                this.handleCheckbox(taskId, e.target.checked);
            } else if (e.target.matches('.delete-btn')) {
                this.deleteTask(taskId);
            } else if (e.target.matches('.edit-btn')) {
                this.toggleEditMode(taskElement);
            }
        });
    }

    static renderTasks(tasks) {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-content">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <span>${task.title}</span>
                </div>
                <div class="task-actions">
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    static handleAddTask(e) {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const dueDate = document.getElementById('dueDate').value;

        if (!title || !dueDate) return;

        this.taskManager.addTask({ title, description, dueDate });
        this.renderFilteredTasks();
        this.toggleTaskInput();
        this.clearInputs();
    }

    static deleteTask(taskId) {
        this.taskManager.deleteTask(taskId);
        this.renderFilteredTasks();
    }

    static handleCheckbox(taskId, completed) {
        this.taskManager.updateTask(taskId, { completed });
        this.renderFilteredTasks();
    }

    static toggleEditMode(taskElement) {
        const taskId = parseInt(taskElement.dataset.id);
        const task = this.taskManager.tasks.find(t => t.id === taskId);
        const newTitle = prompt('Edit task title:', task.title);
        if (newTitle) {
            this.taskManager.updateTask(taskId, { title: newTitle });
            this.renderFilteredTasks();
        }
    }

    static renderFilteredTasks() {
        const filterType = document.getElementById('filter').value;
        const sortBy = document.getElementById('sort').value;
        let tasks = this.taskManager.filterTasks(filterType);
        tasks = this.taskManager.sortTasks(tasks, sortBy);
        this.renderTasks(tasks);
    }

    static toggleTaskInput() {
        document.querySelector('.task-input').classList.toggle('hidden');
    }

    static cancelTask() {
        this.toggleTaskInput();
        this.clearInputs();
    }

    static clearInputs() {
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('dueDate').value = '';
    }
}
