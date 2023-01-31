import { useReducer } from "../react"

const stateReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        input: '',
        todos: [...state.todos, action.payload]
      }
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      }
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload) {
            return {
              ...todo,
              completed: !todo.completed
            }
          }
          return todo;
        })
      }
    case 'UPDATE_INPUT':
      return {
        ...state,
        input: action.payload
      }
    default:
      return state;
  }
}

const INITIAL_STATE = {
  todos: [],
  input: '',
}


const useTodo = () => {
  const [state, dispatch] = useReducer(stateReducer, INITIAL_STATE);

  const addTodo = (todo) => {
    dispatch({
      type: 'ADD_TODO',
      payload: todo
    })
  }

  const removeTodo = (id) => {
    dispatch({
      type: 'REMOVE_TODO',
      payload: id
    })
  }

  const toggleTodo = (id) => {
    dispatch({
      type: 'TOGGLE_TODO',
      payload: id
    })
  }

  const updateInput = (input) => {
    dispatch({
      type: 'UPDATE_INPUT',
      payload: input
    })
  }

  return {
    state,
    addTodo,
    removeTodo,
    toggleTodo,
    updateInput,
  }
}

export {
  useTodo
}
