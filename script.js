const apiURL = "http://localhost:4730/todos/";
const btnAddTodo = document.querySelector("#add-todo");
const btnDelDone = document.querySelector("#del-done");
let todos = [];

//let todos = JSON.parse(localStorage.getItem("todos") || [] -> macht if schleife unnöttig

let filterDoneisActive = false;
let filterOpenisActive = false;
getData();

btnAddTodo.addEventListener("click", addTodo);

document.getElementById("done").addEventListener("change", () => {
  filterDoneisActive = true;
  filterOpenisActive = false;
  render();
});

document.getElementById("open").addEventListener("change", () => {
  filterOpenisActive = true;
  filterDoneisActive = false;
  render();
});

document.getElementById("all").addEventListener("change", () => {
  filterOpenisActive = false;
  filterDoneisActive = false;
  render();
});

async function addTodo() {
  const todoDescription = document.querySelector("#todo-description");
  if (todoDescription.value < 3) {
    return;
  }
  let newTodo = { description: todoDescription.value, done: false };
  const response = await fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  });
  const data = await response.json();

  todos.push(data);

  todoDescription.value = "";
  todoDescription.focus();
  render();
}

async function getData() {
  const response = await fetch(apiURL);
  const data = await response.json();

  todos = data;
  render();
}

function render() {
  const list = document.querySelector("#todos-output");
  list.innerHTML = "";

  let todoList = [];

  if (filterDoneisActive) {
    todoList = filterDones();
  } else if (filterOpenisActive) {
    todoList = filterOpens();
  } else {
    todoList = todos;
  }
  todoList.forEach((todo) => {
    const listEl = document.createElement("li");
    const checkboxEl = document.createElement("input");
    const labelEl = document.createElement("label");
    checkboxEl.setAttribute("type", "checkbox");
    checkboxEl.value = todo.description;
    checkboxEl.checked = todo.done;
    checkboxEl.setAttribute("id", "id-" + todo.id);
    labelEl.setAttribute("for", "id-" + todo.id);
    labelEl.innerText = todo.description;
    listEl.append(checkboxEl);
    listEl.append(labelEl);
    list.append(listEl);

    checkboxEl.addEventListener("change", function () {
      todo.done = !todo.done;
      onCheckboxChange(todo.id, todo);
    });
  });
}
async function onCheckboxChange(id, todo) {
  const response = await fetch(apiURL + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  const data = await response.json();
}

function filterDones() {
  return todos.filter((todo) => todo.done === true);
}

function filterOpens() {
  return todos.filter((todo) => todo.done === false);
}

btnDelDone.addEventListener("click", delToDo);

async function delToDo() {
  todoList = filterDones();
  todoList.forEach((todo) => {
    fetch(apiURL + todo.id, {
      method: "DELETE",
    });
  });
  getData();
}
