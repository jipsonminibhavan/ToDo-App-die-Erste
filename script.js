const newInput = document.querySelector("#new-todo");
const delbtn = document.querySelector("#btn-delete");
const addbtn = document.querySelector("#btn-add");
const todoList = document.querySelector("#todo-list");
const API_URL = "http://localhost:4730/todos";

let todos = [];

function loadTodos() {
  fetch(API_URL).then((response) => response.json());
  then((todosFromApi) => {
    todos = todosFromApi;
    renderTodos();
  });
}

function renderTodos() {
  todoList.textContent = ""; //alles was vorher ist wird gelöscht

  // Für jedes Todo wird ein Eintrag erzeugt inkl. Checkbox
  todoList.forEach((todo) => {
    const todoLi = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    todoLi.appendChild(checkbox);

    const todoText = document.createTextNode(todo.description);
    todoLi.append(todoText);

    todoList.setAttribute("data-id", todo.id);
    todoList.appendChild(todoLi);
  });
}

function addToDo() {
  newInput.value = "";

  if (newInput.length > 0) {
    const newTodo = {
      description: newInput.value,
      done: false,
    };
    fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((newTodoFromApi) => {
        todos.push(newTodoFromApi);
        renderTodos();
      });
  }
}

function updateTodo(e) {}
const id = e.target.parentElement.getAttribute("data-id");
const updateTodo = {
  description: e.target.nextSibling.textContent,
  done: e.target.checked,
};

fetch(API_URL, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(updateTodo),
})
  .then((response) => response.json())
  .then(() => {
    loadTodos();
  });

function deleteTodos() {
  todos.forEach((todo) => {
    if (todo.done === true) {
      fetch(API_URL + todo.id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          loadTodos();
        });
    }
  });
}

addbtn.addEventListener("click", addToDo);
list.addEventListener("change", updateTodo);
delbtn.addEventListener("click", deleteTodos);

loadTodos();
