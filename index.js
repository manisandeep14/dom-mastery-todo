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


function addTodo(){
  if(input.value != ""){
    let ele = document.createElement("li");
    ele.classList.add("li-st");
    list.append(ele);
    totalCount+=1;
    totalTasks.textContent = totalCount;
    remainingCount = totalCount-completedCount;
    remainingTasks.textContent = remainingCount;

    let div2 = document.createElement("div");
    div2.classList.add("task-left");
    ele.append(div2);

    let input0 = document.createElement("input");
    input0.setAttribute("type", "checkbox");
    div2.append(input0);

    let spaning = document.createElement("span");
    spaning.textContent = input.value;
    div2.append(spaning);

    let div1 = document.createElement("div");
    div1.classList.add("actions");
    ele.append(div1);
 
    let btn1 = document.createElement("button");
    let btn2 = document.createElement("button");

    btn1.textContent = "Delete";
    btn2.textContent = "Edit";
 
 
    div1.append(btn1);
    div1.append(btn2);

    input.value = "";
 
    saveTasks();
  }
}

//on click add to do
btn.addEventListener('click', addTodo);

//on enter add to do
input.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    addTodo();
  }
});

