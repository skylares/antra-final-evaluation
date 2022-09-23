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
      <p class="todo__title" data-id=${todo.id}>${todo.title}</p>
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
    if (e.target.classList[0] === 'todo__edit-button') console.log(e.target.dataset.id);
    if (e.target.classList[0] === 'todo__delete-button') deleteTodo(e.target.dataset.id);
    if (e.target.classList[0] === 'todo__title') console.log(e.target.dataset.id);
  })
}

// ADD
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
  state.setTodos = [...state.getTodos, data];
  renderTodos(state.getTodos);
}

// DELETE
async function deleteTodo(id) {

  await fetch(API_URL + id, {
    method: 'DELETE',  
    headers: {'Content-Type': 'application/json'}
  });
  state.setTodos = [...state.getTodos].filter(todo => todo.id !== id);
  renderTodos(state.getTodos);
}




initEvents();








// function completeTodo(id, completed, title) {

//   let completedState = !completed;

//   fetch(API_URL + id, {
//     method: 'PATCH', 
//     body: JSON.stringify({
//       completed: completedState
//     }), 
//     headers: {'Content-Type': 'application/json'}
//   })
//   .then(res => res.json())
//   .then(todo => renderTodos());
// }


// function editTodo(id, event) {


// }




