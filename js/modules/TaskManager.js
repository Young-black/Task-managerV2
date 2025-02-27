export class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
    }

    loadTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask(task) {
        this.tasks.push({ ...task, id: Date.now(), completed: false });
        this.saveTasks();
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
    }

    updateTask(taskId, updatedFields) {
        this.tasks = this.tasks.map(task => 
            task.id === taskId ? { ...task, ...updatedFields } : task
        );
        this.saveTasks();
    }

    filterTasks(filterType) {
        switch(filterType) {
            case 'completed': return this.tasks.filter(task => task.completed);
            case 'incomplete': return this.tasks.filter(task => !task.completed);
            default: return [...this.tasks];
        }
    }

    sortTasks(tasks, sortBy) {
        return [...tasks].sort((a, b) => {
            if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
            return a.title.localeCompare(b.title);
        });
    }
}