import React from '../react';
import { useTodo } from "./useTodo"

export default function App() {

  const { addTodo, removeTodo, state, toggleTodo, updateInput } = useTodo()

  return (
    <div>
      <h1>Todo List</h1>
      <input type="text" value={state.input} onChange={(e) => updateInput(e.target.value)} />
      <button
        onClick={() => addTodo({
            id: Math.random(),
            text: state.input,
            completed: false,
        })}
      >
        Add
      </button>
      <ul>
        {state.todos.map(todo =>
        <div>
          <li
            onClick={() => toggleTodo(todo.id)}
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
            }}
          >
            {todo.text}
          </li>
          <button onClick={() => removeTodo(todo.id)}>X</button>
        </div>
        )}
      </ul>
    </div>
  )
}
