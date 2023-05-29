import { dispatch } from "./reconciler"

function useState<T>(initialValue: T) {
  return dispatch.useState(initialValue)
}

function useEffect(callback: () => void, deps: unknown[]) {
  return dispatch.useEffect(callback, deps)
}

function useReducer<T>(reducer: (state: T, action: unknown) => T, initialState: T) {
  return dispatch.useReducer(reducer, initialState)
}


export {
  useState,
  useEffect,
  useReducer,
}
