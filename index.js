// init selectors
const input = document.getElementById("taskInput");
const btn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const container = document.querySelector(".container");
const totalTasks = document.querySelector("#totalTasks");
const completedTasks = document.querySelector("#completedTasks");
const remainingTasks = document.querySelector("#remainingTasks");

let totalCount = 0;
let completedCount = 0;
let remainingCount = 0;
