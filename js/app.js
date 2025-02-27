import { TaskManager } from './modules/TaskManager.js';
import { DOM } from './modules/dom.js';

const taskManager = new TaskManager();
DOM.init(taskManager);