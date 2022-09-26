const API_URL = "http://localhost:3000/todos/";

const editIcon = `<svg class="edit-icon "focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>`
const deleteIcon = `<svg class="delete-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`

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
const inputWarning = document.querySelector('#input-warning');

// function to update the HTML and render the todo list
function renderTodos(todos) {

  if (todos.length === 0) todosContainer.innerHTML = '<p class="todo__empty">no active tasks</p>';

  else {
    todosContainer.innerHTML = todos.map(todo => (
      `<div class="todo">
        <p class="todo__title todo__title--${todo.completed}" data-id=${todo.id} onClick=completedTodo(event)>${todo.title}</p>
        <button class="todo__edit-button" onClick=editTodo(event) data-id=${todo.id}>${editIcon}</button>
        <button class="todo__delete-button" onClick=deleteTodo(${todo.id}) data-id=${todo.id}>${deleteIcon}</button>
      </div>`
    )).join("");
  }
}

// initialize the event listener, render the todo list, and update local state with todo list from database
async function initEvents() {

  const response = await fetch(API_URL);
  const todos = await response.json();

  finishedTodos = todos.filter(todo => todo.completed).reverse();
  unfinishedTodos = todos.filter(todo => !todo.completed).reverse();

  state.setTodos = [...unfinishedTodos, ...finishedTodos];
  renderTodos(state.getTodos);

  todoForm.addEventListener("submit", e => {
    e.preventDefault();
    addTodo();
  });
}

// ADD TODO
async function addTodo() {

  if (inputField.value) {
    inputWarning.className = " input-warning--hidden";

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
  else {
    inputWarning.className = "input-warning--visible";
  }
}

// DELETE TODO
async function deleteTodo(id) {

  await fetch(API_URL + id, {
    method: 'DELETE',  
    headers: {'Content-Type': 'application/json'}
  });

  const response = await fetch(API_URL);
  const todos = await response.json();
  
  finishedTodos = todos.filter(todo => todo.completed).reverse();
  unfinishedTodos = todos.filter(todo => !todo.completed).reverse();

  state.setTodos = [...unfinishedTodos, ...finishedTodos];
  renderTodos(state.getTodos);
}

// EDIT TODO
function editTodo(e) {

  let tempStateArr = state.getTodos;
  const todoIndex = state.getTodos.findIndex(todo => todo.id === e.target.dataset.id);
  let todo = state.getTodos[todoIndex];

  e.target.parentElement.innerHTML = `
    <input class="todo__edit-input" value="${todo.title}"}/>
    <button class="todo__edit-button--submit" data-id=${todo.id}>${editIcon}</button>
    <button class="todo__delete-button" onClick=deleteTodo(${todo.id}) data-id=${todo.id}>${deleteIcon}</button>
  `;

  const editInputField = document.querySelector('.todo__edit-input');
  const submittedEditButton = document.querySelector('.todo__edit-button--submit');

  submittedEditButton.addEventListener("click", event => {

    fetch(API_URL + todo.id, {
      method: 'PATCH',  
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: editInputField.value
      })
    })
    .then(res => res.json())
    .then(data => {
      tempStateArr.splice(todoIndex, 1, data);
      renderTodos(tempStateArr);
      state.setTodos = tempStateArr;
    });
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

  let tempStateArr = state.getTodos.filter(todo => todo.id !== e.target.dataset.id);
  if (data.completed) state.setTodos = [...tempStateArr, data];
  else state.setTodos = [data, ...tempStateArr];
  
  renderTodos(state.getTodos);
}

initEvents();








