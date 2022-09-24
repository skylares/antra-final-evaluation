const API_URL = "http://localhost:3000/todos/";

// state to hold todo list locally
class State {
  constructor() {
    this._todos = [];
  }
  
  get getTodos() {
    return this._todos;
  }

  set setTodos(todos) {
    this._todos = todos;
  }
}
const state = new State();

const todoForm = document.querySelector('.todo-form');
const inputField = document.querySelector('.todo-form__input');
const todosContainer = document.querySelector('.todos-container');

// function to update the HTML and render the todo list
function renderTodos(todos) {

  todosContainer.innerHTML = todos.map(todo => (
    `<div class="todo">
      <p class="todo__title todo__title--${todo.completed}" data-id=${todo.id}>${todo.title}</p>
      <button class="todo__edit-button" data-id=${todo.id}>edit</button>
      <button class="todo__delete-button" data-id=${todo.id}>delete</button>
    </div>`
  )).join("");
}

// initialize the event listeners, render the todo list, and update local state with todo list from database
async function initEvents() {

  const response = await fetch(API_URL);
  const todos = await response.json();
  state.setTodos = todos;
  renderTodos(state.getTodos);

  todoForm.addEventListener("submit", e => {
    e.preventDefault();
    addTodo();
  });

  todosContainer.addEventListener("click", e => {
    if (e.target.classList[0] === 'todo__edit-button') editTodo(e);
    if (e.target.classList[0] === 'todo__delete-button') deleteTodo(e.target.dataset.id);
    if (e.target.classList[0] === 'todo__title') completedTodo(e);
  })
}

// ADD TODO
async function addTodo() {

  const newTodo = {
    id: Date.now().toString(),
    "title": inputField.value,
    "completed": false,
  };

  const response = await fetch(API_URL, {
    method: 'POST', 
    body: JSON.stringify(newTodo), 
    headers: {'Content-Type': 'application/json'}
  });
  const data = await response.json(); 
  state.setTodos = [data, ...state.getTodos];
  renderTodos(state.getTodos);
}

// DELETE TODO
async function deleteTodo(id) {

  await fetch(API_URL + id, {
    method: 'DELETE',  
    headers: {'Content-Type': 'application/json'}
  });
  state.setTodos = [...state.getTodos].filter(todo => todo.id !== id);
  renderTodos(state.getTodos);
}

// EDIT TODO
function editTodo(e) {

  let todo = state.getTodos.find(todo => todo.id === e.target.dataset.id);

  e.target.parentElement.innerHTML = `
    <input class="todo__edit-input" value="${todo.title}"}/>
    <button class="todo__edit-button--submit" data-id=${todo.id}>submit changes</button>
    <button class="todo__delete-button" data-id=${todo.id} type="submit">delete</button>
  `;

  const editInputField = document.querySelector('.todo__edit-input');
  const submittedEditButton = document.querySelector('.todo__edit-button--submit');

  submittedEditButton.addEventListener("click", event => {
    event.target.parentElement.innerHTML = `
      <p class="todo__title" data-id=${todo.id}>${editInputField.value}</p>
      <button class="todo__edit-button" data-id=${todo.id}>edit</button>
      <button class="todo__delete-button" data-id=${todo.id}>delete</button>
    `;

    fetch(API_URL + todo.id, {
      method: 'PATCH',  
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: editInputField.value
      })
    })
    .then(res => res.json())
    .then(data => state.setTodos = [...state.getTodos.filter(ele => ele.id !== todo.id), data]);
  });
}

// COMPLETE TODO
async function completedTodo(e) {

  let currentTodo = state.getTodos.find(todo => todo.id === e.target.dataset.id);

  const response = await fetch(API_URL + currentTodo.id, {
    method: 'PATCH',  
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      completed: !currentTodo.completed
    })
  });
  const data = await response.json();

  if (data.completed) state.setTodos = [...state.getTodos.filter(todo => todo.id !== e.target.dataset.id), data];
  else state.setTodos = [data, ...state.getTodos.filter(todo => todo.id !== e.target.dataset.id)];
  
  renderTodos(state.getTodos);
}









// second way to submit edit. allows enter functionality, but has a warning message about form submission canceling.

// async function editTodo(e) {

//   let todo = state.getTodos.find(todo => todo.id === e.target.dataset.id);

//   e.target.parentElement.innerHTML = `
//     <form class="todo__form">
//       <input class="todo__edit-input" value="${todo.title}"}/>
//       <button class="todo__edit-button--submit" data-id=${todo.id}>submit changes</button>
//       <button class="todo__delete-button" data-id=${todo.id} type="submit">delete</button>
//     </form>
//   `;

//   const editInputField = document.querySelector('.todo__edit-input');
//   const todoForm = document.querySelector('.todo__form');

//   todoForm.addEventListener("submit", event => {
//     e.preventDefault();
//     event.target.parentElement.innerHTML = `
//       <form class="todo__form"></form>
//       <p class="todo__title" data-id=${todo.id}>${editInputField.value}</p>
//       <button class="todo__edit-button" data-id=${todo.id}>edit</button>
//       <button class="todo__delete-button" data-id=${todo.id}>delete</button>
//     `;
//   });
// }




initEvents();








