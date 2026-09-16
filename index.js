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

//render tasks from local storage

let score = {
  tCount : 0,
  cCount : 0,
  rCount : 0
};

let arr = renderTasks();


arr.forEach(taskObj => {

    let ele = document.createElement("li");
    ele.classList.add("li-st");

    if(taskObj.complete){
        ele.classList.add("completed");
    }

    list.append(ele);

    let div2 = document.createElement("div");
    div2.classList.add("task-left");
    ele.append(div2);

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = taskObj.complete;

    div2.append(checkbox);

    let span = document.createElement("span");
    span.textContent = taskObj.task;

    div2.append(span);

    let div1 = document.createElement("div");
    div1.classList.add("actions");
    ele.append(div1);

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    div1.append(deleteBtn);
    div1.append(editBtn);

});

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


//To delete To Edit task
list.addEventListener('click', (e)=>{
  const task = e.target.closest('.li-st');
  if(e.target.textContent === "Delete"){
    const isCompleted = task.querySelector('input').checked;
    task.remove();
    totalCount-=1;
    totalTasks.textContent = totalCount;
 
    if(isCompleted){
      updateTotal(completedCount-=1);
    }else{
      updateTotal(completedCount -= 0);
    }
  }
  else if(e.target.textContent === "Edit"){
    let par = task;
    while(true){
      let valueInput = prompt("Update your task");
      if(valueInput !== null){
        if(valueInput !== ""){
            par.querySelector('span').textContent = valueInput;
            alert("Task Modified");
          break;
        }
      }else{
        break;
      }
    }
  }
  else if(e.target.tagName === "INPUT"){
    let newCls = task;
    if(e.target.checked){
      newCls.classList.add("completed");
      updateTotal(completedCount+=1);
    }else if(!e.target.checked){
      newCls.classList.remove("completed");
      updateTotal(completedCount-=1);
    }
  }
  saveTasks();
});

//update total tasks count

function updateTotal(completedCount){
  completedTasks.textContent = completedCount;
  remainingCount = totalCount-completedCount;
  remainingTasks.textContent = remainingCount;
}

//categories of tasks
let active = document.querySelector("#id101");
let completed = document.querySelector("#id102");
let all = document.querySelector(".active");
let clearComplete = document.querySelector("#clearCompleted");

//functionalities of categories
active.addEventListener('click', ()=>{
  retrive();
  let temp = list;
  for(let item of temp.children){
    if(item.firstChild.firstChild.checked){
      item.style.display = "none";
    }
  }
});

all.addEventListener('click', ()=>{
 retrive();
});

completed.addEventListener('click', ()=>{
  retrive();
  let temp1 = list;
  for(let item of temp1.children){
    if(!item.firstChild.firstChild.checked){
      item.style.display = "none";
    }
  }
  saveTasks();
});

clearComplete.addEventListener('click', ()=>{
  let count = 0;
  retrive();
  let temp = list;
  for(let item of [...temp.children]){
    if(item.firstChild.firstChild.checked){
      item.remove();
      count+=1;
    }
  }
  totalCount-=count;
  totalTasks.textContent = totalCount;
  updateTotal(completedCount-= count);
  saveTasks();
})


function retrive(){
  for(let item of list.children){
    item.style.display = "flex";
  }
}
//local storage functions

function renderTasks(){
  let scoreC = JSON.parse(localStorage.getItem("tasksUpdate"));
  if(scoreC){
    totalCount = scoreC.tCount;
    completedCount = scoreC.cCount;
    remainingCount = scoreC.rCount;
 
    totalTasks.textContent = totalCount;
    completedTasks.textContent = completedCount;
    remainingTasks.textContent = remainingCount;
  }
  return JSON.parse(localStorage.getItem("myTasks")) || [];
}

function saveTasks(){
  arr = [];
  for(let item of list.children){
    arr.push({task : item.querySelector('span').innerText,
              complete : item.querySelector('input').checked
    });
  }
  score = {
    tCount : totalCount,
    cCount : completedCount,
    rCount : remainingCount
  };

  localStorage.setItem("tasksUpdate", JSON.stringify(score));
  localStorage.setItem("myTasks",JSON.stringify(arr));
}


