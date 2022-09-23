const API_URL = `http://localhost:3000/todos/`;
let todoList = [];

const todoForm = document.querySelector('.todo-form');
const inputField = document.querySelector('.todo-form__input');
const todosContainer = document.querySelector('.todos-container');



function initEvents() {
  todoForm.addEventListener("submit", e => {
    e.preventDefault();
    addTodo(inputField.value);
  });
}

function addTodo(title) {

  const newTodo = {
    id: Date.now().toString(),
    "title": title,
    "completed": false,
  };

  fetch(API_URL, {
    method: 'POST', 
    body: JSON.stringify(newTodo), 
    headers: {'Content-Type': 'application/json'}
  })
  .then(res => res.json())
  .then(todos => renderTodos(todos));
}

function completeTodo(id, completed, title) {

  let completedState = !completed;

  fetch(API_URL + id, {
    method: 'PATCH', 
    body: JSON.stringify({
      completed: completedState
    }), 
    headers: {'Content-Type': 'application/json'}
  })
  .then(res => res.json())
  .then(todo => renderTodos());
}


function editTodo(id, event) {


}

function deleteTodo(id) {

  fetch(API_URL + id, {
    method: 'DELETE',  
    headers: {'Content-Type': 'application/json'}
  })
  .then(res => res.json())
  .then(todos => renderTodos(todos));
}

async function renderTodos() {

  const response = await fetch(API_URL);
  const todos = await response.json();
  todos.forEach(todo => todoList.push(todo));

  todosContainer.innerHTML = todos.map(todo => (
    `<div class="todo">
      <p class="todo__title" onClick="completeTodo(${todo.id}, ${todo.completed}, ${todo.title})">${todo.title}</p>
      <button class="todo__edit-button" onClick="editTodo(${todo.id})">edit</button>
      <button class="todo__delete-button" onClick="deleteTodo(${todo.id})">delete</button>
    </div>`
  )).join("");
}

renderTodos();
initEvents();