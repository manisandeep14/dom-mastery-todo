// init selectors
const input = document.getElementById("taskInput");
const btn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const totalTasks = document.querySelector("#totalTasks");
const completedTasks = document.querySelector("#completedTasks");
const remainingTasks = document.querySelector("#remainingTasks");
const title = document.querySelector(".title");
const filterButtons = document.querySelectorAll(".filter");
const allFilterBtn = document.querySelector(".filter.active");
const activeFilterBtn = document.querySelector("#id101");
const completedFilterBtn = document.querySelector("#id102");
const clearCompleteBtn = document.querySelector("#clearCompleted");
const themeToggleBtn = document.getElementById("themeToggle");
const resetStorageBtn = document.getElementById("resetStorageBtn");

let tasks = [];
let currentFilter = "all";
let draggedTaskId = null;

function generateTaskId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem("myTasks"));

    if (!Array.isArray(savedTasks)) {
      return [];
    }

    return savedTasks
      .filter((task) => task && typeof task.task === "string")
      .map((task) => ({
        id: task.id || generateTaskId(),
        task: task.task.trim(),
        complete: Boolean(task.complete),
      }));
  } catch (error) {
    console.error("Could not read tasks from localStorage:", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.complete).length;
  const remaining = total - completed;

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  remainingTasks.textContent = remaining;
}

function applyFilter() {
  const items = list.querySelectorAll(".li-st");

  items.forEach((item) => {
    const taskId = item.dataset.id;
    const task = tasks.find((entry) => entry.id === taskId);

    if (!task) {
      item.style.display = "none";
      return;
    }

    const showTask =
      currentFilter === "all" ||
      (currentFilter === "active" && !task.complete) ||
      (currentFilter === "completed" && task.complete);

    item.style.display = showTask ? "flex" : "none";
  });
}

function setActiveFilter(selectedButton) {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button === selectedButton);
  });
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("li-st");
  li.dataset.id = task.id;
  li.draggable = true;

  if (task.complete) {
    li.classList.add("completed");
  }

  const divLeft = document.createElement("div");
  divLeft.classList.add("task-left");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.complete;

  const span = document.createElement("span");
  span.textContent = task.task;

  divLeft.append(checkbox, span);

  const actions = document.createElement("div");
  actions.classList.add("actions");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";

  actions.append(deleteBtn, editBtn);
  li.append(divLeft, actions);

  return li;
}

function applyTheme() {
  const isDarkMode = localStorage.getItem("themeMode") === "dark";
  document.body.classList.toggle("dark-mode", isDarkMode);
  themeToggleBtn.textContent = isDarkMode ? "☀️ Light mode" : "🌙 Dark mode";
}

function renderTasks() {
  list.innerHTML = "";

  tasks.forEach((task) => {
    list.appendChild(createTaskElement(task));
  });

  applyFilter();
  updateStats();
}

function addTodo() {
  const taskText = input.value.trim();

  if (!taskText) {
    input.focus();
    return;
  }

  tasks.push({
    id: generateTaskId(),
    task: taskText,
    complete: false,
  });

  saveTasks();
  renderTasks();
  input.value = "";
  input.focus();
}

btn.addEventListener("click", addTodo);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

list.addEventListener("click", (event) => {
  const taskItem = event.target.closest(".li-st");
  if (!taskItem) return;

  const taskId = taskItem.dataset.id;
  const task = tasks.find((entry) => entry.id === taskId);
  if (!task) return;

  if (event.target.textContent === "Delete") {
    tasks = tasks.filter((entry) => entry.id !== taskId);
    saveTasks();
    renderTasks();
    return;
  }

  if (event.target.textContent === "Edit") {
    const updatedTask = prompt("Update your task", task.task);

    if (updatedTask === null) {
      return;
    }

    const trimmedValue = updatedTask.trim();

    if (!trimmedValue) {
      alert("Task cannot be empty.");
      return;
    }

    task.task = trimmedValue;
    saveTasks();
    renderTasks();
    return;
  }

  if (event.target.tagName === "INPUT") {
    task.complete = event.target.checked;
    saveTasks();
    renderTasks();
  }
});

list.addEventListener("dragstart", (event) => {
  const taskItem = event.target.closest(".li-st");
  if (!taskItem) return;

  draggedTaskId = taskItem.dataset.id;
  taskItem.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
});

list.addEventListener("dragover", (event) => {
  const dropTarget = event.target.closest(".li-st");
  if (!dropTarget) return;

  event.preventDefault();
  dropTarget.classList.add("drag-over");
});

list.addEventListener("dragleave", (event) => {
  const dropTarget = event.target.closest(".li-st");
  if (dropTarget) {
    dropTarget.classList.remove("drag-over");
  }
});

list.addEventListener("drop", (event) => {
  const dropTarget = event.target.closest(".li-st");
  if (!dropTarget || !draggedTaskId) return;

  event.preventDefault();
  dropTarget.classList.remove("drag-over");

  const fromIndex = tasks.findIndex((task) => task.id === draggedTaskId);
  const toIndex = tasks.findIndex((task) => task.id === dropTarget.dataset.id);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    draggedTaskId = null;
    return;
  }

  const [movedTask] = tasks.splice(fromIndex, 1);
  tasks.splice(toIndex, 0, movedTask);
  saveTasks();
  renderTasks();
  draggedTaskId = null;
});

list.addEventListener("dragend", (event) => {
  const taskItem = event.target.closest(".li-st");
  if (taskItem) {
    taskItem.classList.remove("dragging");
  }

  list.querySelectorAll(".li-st").forEach((item) => item.classList.remove("drag-over"));
  draggedTaskId = null;
});

allFilterBtn.addEventListener("click", () => {
  currentFilter = "all";
  setActiveFilter(allFilterBtn);
  applyFilter();
});

activeFilterBtn.addEventListener("click", () => {
  currentFilter = "active";
  setActiveFilter(activeFilterBtn);
  applyFilter();
});

completedFilterBtn.addEventListener("click", () => {
  currentFilter = "completed";
  setActiveFilter(completedFilterBtn);
  applyFilter();
});

clearCompleteBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.complete);
  saveTasks();
  renderTasks();
});

resetStorageBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all saved tasks?")) {
    tasks = [];
    localStorage.removeItem("myTasks");
    localStorage.removeItem("tasksUpdate");
    renderTasks();
  }
});

themeToggleBtn.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  localStorage.setItem("themeMode", isDarkMode ? "dark" : "light");
  themeToggleBtn.textContent = isDarkMode ? "☀️ Light mode" : "🌙 Dark mode";
});

title.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    localStorage.removeItem("myTasks");
    localStorage.removeItem("tasksUpdate");
    renderTasks();
  }
});

applyTheme();
tasks = readTasks();
renderTasks();
