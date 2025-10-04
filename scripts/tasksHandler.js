"use strict";

document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
  showOverview()
});

const addTaskBtn = getSmth("button#addTask");
const askTaskCont = getSmth(".askCont");
const overview = getSmth(".overview-wrapper");
// overview.innerHTML = ""
let tasks = [];
let doneTasks = [];
let canceledTasks = [];

function getSmth(elem) {
  return document.querySelector(elem);
}

const changeArray = getSmth("button#styleArray");

let taskTime = getSmth("input#datetime");
const local = new Date().toISOString().slice(0, 16);
taskTime.value = local;
taskTime.min = local;

// format = "List"
let format = changeArray.innerText;
localStorage.setItem("display-style", changeArray.innerText);

changeArray.addEventListener("click", () => {
  if (localStorage.getItem("display-style") === "LIST") {
    changeArray.innerText = "GRID";
    changeArray.style.gridTemplateColumns =
      "repeat(auto-fill, minmax(var(--card-width), 1fr))";
    localStorage.setItem("display-style", changeArray.innerText);
  } else if (localStorage.getItem("display-style") === "GRID") {
    changeArray.innerText = "LIST";
    changeArray.style.gridTemplateColumns = "none";
    localStorage.setItem("display-style", changeArray.innerText);
  }
});

if (askTaskCont) {
  // console.log("works");
} else {
  console.log("works not");
}

function createTask() {
  window.addEventListener("click", (e) => {
    if (!askTaskCont.contains(e.target) && e.target !== addTaskBtn) {
      askTaskCont.classList.remove("active");
    } else {
      askTaskCont.classList.add("active");
    }
  });
  const form = askTaskCont.querySelector(".addForm");

  // const submitBtn = document.getElementById("submit");

  let taskName = document.querySelector("input#task");
  let taskDetail = document.querySelector("textarea#details");
  let taskdatetime = document.querySelector("input#datetime");
  let status = "n";
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const params = [taskName, taskDetail, status, taskdatetime];
    addTask(...params);
    askTaskCont.classList.remove("active");
    form.reset();
  });
  form.addEventListener("reset", (e) => {
    askTaskCont.classList.remove("active");
  });
}

function addTask(t, d, st, tt) {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const task_name = t.value;
  const task_details = d.value;

  if (!task_name || !task_details || !tt.value) {
    // alert("Please fill in all fields.");
    return;
  }
  const taskInfo = {
    id: tt.value,
    name: task_name,
    status: st,
    details: task_details,
    "due-time": tt.value,
  };

  tasks.push(taskInfo);
  updateTasks();
  loadTasks();
  showOverview();
}

function updateTasks() {
  let taskJson = JSON.stringify(tasks);

  localStorage.setItem("tasks", taskJson);

  console.log(localStorage.getItem("tasks"));
}
function loadTasks() {
  let loadedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  getSmth(".tasks-wrapper");
  if (loadedTasks.length !== 0) {
    const taskWrapper = getSmth(".tasks-wrapper");
    taskWrapper.innerHTML = "";

    loadedTasks.forEach((task, index) => {
      const id = task.id;
      const name = task.name;
      const status = task.status;
      const details = task.details;
      const time = task["due-time"].split("T").join(" ");

      const tDiv = document.createElement("div");
      tDiv.classList.add("task");
      tDiv.setAttribute("data-id", index);
      tDiv.setAttribute("data-date", id);
      tDiv.innerHTML = `<div id="task-detail">
                                <p data-date="${time}" class="date">Due Date: ${time} </p>
                                <h3 class="taskTitle" data-title="${name}">${name}</h3>
                                <p class="Task Details" data-detials="${details}"> ${details}                               </p>
                            </div>
                            <div class="opt-btns" id="optBtns">
                                <button id="removeTaskBtn" class="remove-btn">Remove Task</button>
                                <button id="clearTaskBtn" class="clear-btn">Done Task</button>
                            </div>`;

      taskWrapper.appendChild(tDiv);

      const removeBtn = tDiv.querySelector(`.remove-btn`);
      const clearBtn = tDiv.querySelector(`#clearTaskBtn`);

      // taskWrapper.innerHTML += taskDiv;

      removeBtn.addEventListener("click", () => {
        canceledTasks = JSON.parse(localStorage.getItem("canceled-tasks")) || [];
        canceledTasks.push(task);
        localStorage.setItem("canceled-tasks", JSON.stringify(canceledTasks));
        loadedTasks = loadedTasks.filter((t) => t.id !== task.id);
        localStorage.setItem("tasks", JSON.stringify(loadedTasks));
        tDiv.remove();

        showOverview();
        loadTasks(); // Only this, no tDiv.remove()
      });

      clearBtn.addEventListener("click", () => {
        doneTasks = JSON.parse(localStorage.getItem("doneed-tasks")) || [];
        doneTasks.push(task);
        localStorage.setItem("doneed-tasks", JSON.stringify(doneTasks));
        loadedTasks = loadedTasks.filter((t) => t.id !== task.id);
        localStorage.setItem("tasks", JSON.stringify(loadedTasks));
        tDiv.remove();
        showOverview();
        loadTasks();
      });

    });
  }
}
function showOverview() {
  const tP = document.createElement("p");
  const cP = document.createElement("p");
  const dP = document.createElement("p");
  const tlP = document.createElement("p");
  const cs = [tP, cP, dP, tlP];
  const cls = ["tot", "can", "don", "tlo"];
  overview.innerHTML = "";
  cs.forEach((elem, index) => {
    elem.classList.add(cls[index]);
    overview.appendChild(elem);
  });
  let loadedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const cTasks = JSON.parse(localStorage.getItem("canceled-tasks")) || [];
  const dTasks = JSON.parse(localStorage.getItem("doneed-tasks")) || [];

  // const cs = [tP, cP, dP];
  const texts = ["Current Tasks", "Canceled Tasks", "Tasks Done", 'Total Tasks'];
  const text = ["Current Task", "Canceled Task", "Task Done", 'Total Task'];

  const totalTasks = [...loadedTasks, ...cTasks, ...dTasks]
  const ts = [loadedTasks, cTasks, dTasks, totalTasks];

  cs.forEach((elem, index) => {
    let percentage = (1 - (ts[index].length / totalTasks.length)) * 100;
    if (ts[index].length === 1) {
      texts[index] = text[index]
    }
    elem.style.setProperty('--p', `${percentage}%`)
    elem.innerHTML = `<span>${ts[index].length} ${texts[index]}</span>`
    // elem.style.flexGrow = percentage || 0;

    // document.documentElement.style.setProperty

    // overview.appendChild(elem);
  });


  //07041044000
}
