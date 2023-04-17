function uid() {
  return Date.now().toString(16) + Math.random().toString(16).substring(2);
}

let taskData = [
]

let taskDataString = localStorage.getItem('TodoList');
if (taskDataString !== null) {
  taskData = JSON.parse(taskDataString);
}


const addTaskInput = document.getElementById("task_input");
const addTaskButton = document.getElementsByTagName("button")[0];
const taskList = document.getElementById("tasks_list");
const todoCounterText = document.getElementById("todo_count");
const doneCounterText = document.getElementById("done_count");
const emptyTask = document.getElementById("empty_tasks")

//empty tasks
function verifyIfListIsEmpty() {
  if (taskData.length === 0) {
    emptyTasks.classList.remove("hidden");
  } else {
    emptyTask.classList.add("hidden");
  }
}

// counter tasks
function counter() {
  let toDoCounter = 0;
  let doneCounter = 0;

  toDoCounter = taskData.length;
  todoCounterText.innerText = `${toDoCounter}`;

  for (const task of taskData) {
    if (task.toDo === false) {
      doneCounter++;
    }
  }
  doneCounterText.innerText = `${doneCounter}`;
}
verifyIfListIsEmpty();
counter();

// create new task element
function createNewTaskEl(taskName, taskId, taskToDo) {

  // create task li
  let task = document.createElement("li");
  task.classList.add("task");

  if (taskToDo) {
    task.classList.add("todo");
  } else {
    task.classList.add("done");
  }

  task.setAttribute("id", taskId);

  // create .left_content div
  let leftContent = document.createElement("div");
  leftContent.classList.add("left_content");

  // todo icon
  let todoIcon = document.createElement("i");
  todoIcon.classList.add("ph-duotone");
  todoIcon.classList.add("ph-circle-dashed");
  todoIcon.classList.add("check_btn");
  if (!taskToDo) {
    todoIcon.classList.add("hidden");
  }
  todoIcon.addEventListener("click", completeTask);

  // done icon
  let doneIcon = document.createElement("i");
  doneIcon.classList.add("ph-duotone");
  doneIcon.classList.add("ph-check-circle");
  doneIcon.classList.add("check_btn");
  if (taskToDo) {
    doneIcon.classList.add("hidden");
  }
  doneIcon.addEventListener("click", incompleteTask);

  // task name / p
  let name = document.createElement("p");
  name.innerHTML = taskName;
  if (!taskToDo) {
    name.classList.add("risked");
  }

  // delete icon
  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("ph-duotone");
  deleteIcon.classList.add("ph-trash");
  deleteIcon.classList.add("delete_btn");
  deleteIcon.addEventListener("click", deleteTask);
  leftContent.appendChild(todoIcon);
  leftContent.appendChild(doneIcon);
  leftContent.appendChild(name);

  task.appendChild(leftContent);
  task.appendChild(deleteIcon);

  return task;
}

// add new task
function addTask(event) {
  event.preventDefault();
  console.log('Add Task');
  const newTaskName = addTaskInput.value;
  const newTask = {
    id: uid(),
    name: newTaskName,
    toDo: true,
  }

  taskData.push(newTask);
  const taskElement = createNewTaskEl(newTask.name, newTask.id, newTask.toDo);
  taskList.appendChild(taskElement);
  addTaskInput.value = '';
  counter();
  verifyIfListIsEmpty();

  localStorage.setItem("TodoList", JSON.stringify(taskData));
}


// complete task
function completeTask(event) {
  console.log('Complete task');

  const todoIcon = event.target;
  todoIcon.classList.add("hidden");

  const text = todoIcon.parentNode.childNodes[2];
  text.classList.add("risked");

  const taskToCompletId = todoIcon.parentNode.parentNode.id;
  const taskToComplete = document.getElementById(taskToCompletId);

  taskToComplete.classList.add("done");
  taskToComplete.classList.remove("todo");

  const doneIcon = todoIcon.parentNode.childNodes[1];
  doneIcon.classList.remove("hidden");

  const task = taskData.find((item) => {
    if (item.id === taskToCompletId) {
      item.toDo = false;
    }
  })
  counter();
  localStorage.setItem("TodoList", JSON.stringify(taskData));
}
// incomplete task
function incompleteTask(event) {
  console.log('Incomplete task');

  const doneIcon = event.target;
  doneIcon.classList.add("hidden");

  const text = doneIcon.parentNode.childNodes[2];
  text.classList.remove("risked");

  const taskToIncompleteId = doneIcon.parentNode.parentNode.id;
  const taskToIncomplete = document.getElementById(taskToIncompleteId)

  taskToIncomplete.classList.add("todo");
  taskToIncomplete.classList.remove("done");

  const todoIcon = doneIcon.parentNode.childNodes[0];
  todoIcon.classList.remove("hidden");

  taskData.find((item) => {
    if (item.id === taskToIncompleteId) {
      item.toDo = true;
    }
  });
  counter();
  localStorage.setItem("TodoList", JSON.stringify(taskData));
}
// delete task
function deleteTask(event) {
  console.log('Delete Task');

  const taskToDeleteId = event.target.parentNode.id;
  const taskToDelete = document.getElementById(taskToDeleteId);

  const tasksWithoutDeletedOne = taskData.filter(
    (task) => {
      return task.id !== taskToDeleteId;
    }
  );
  taskData = tasksWithoutDeletedOne;
  taskList.removeChild(taskToDelete);

  counter();
  localStorage.setItem("TodoList", JSON.stringify(taskData));
  verifyIfListIsEmpty();
}
// sync HTML with taskData list

for (const task of taskData) {
  const taskItem = createNewTaskEl(task.name, task.id, task.toDo);
  taskList.appendChild(taskItem);
}