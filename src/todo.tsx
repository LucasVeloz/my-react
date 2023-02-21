import React from "../react";
import { useTodo } from "./useTodo";

export const Todo = () => {
  const { addTodo, removeTodo, state, toggleTodo, updateInput } = useTodo()
  return (
    <div>
    <h3>Todo List</h3>
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
      <ul
        style={{
          height: '200px',
          overflow: 'scroll',
        }}
      >
      <code>
        nosso estado sendo alterado em re-renders: {JSON.stringify(state)}
      </code>
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
};
