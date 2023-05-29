import { __DOM } from "./DOM";
import { render } from "./render";

const hooks = [];
let index = 0;
// const contexts = [];
// let contextIndex = 0;

function scheduleReRender() {
  const newVirtualDOM = __DOM.root.component();
  __DOM.virtualDom = newVirtualDOM;


  __DOM.root.element.children[0].remove()

  index = 0;
  render(newVirtualDOM, __DOM.root.element)
}


const dispatch = Object.freeze({
  useState<T>(initialValue: T) {
    const currentIndex = index;
    index++;

    hooks[currentIndex] = hooks[currentIndex] || initialValue;

    function setState(newValue: T  | ((currentValue: T) => T)) {
      if (newValue instanceof Function) {
        hooks[currentIndex] = newValue(hooks[currentIndex]);
      } else {
        hooks[currentIndex] = newValue;
      }

      scheduleReRender();
    }

    return [hooks[currentIndex], setState] as const;
  },
  useEffect(callback: () => void, deps: unknown[]) {
    const currentIndex = index;

    const hasChanged = deps.some((item, i) => {
      if (hooks[currentIndex]) {
        return item !== hooks[currentIndex][i];
      }
      return false;
    });


    if (hasChanged || !hooks[currentIndex]) callback();


    hooks[currentIndex] = deps;
    index++;
  },
  useReducer<T>(reducer: (state: T, action: unknown) => T, initialState: T) {
    const currentIndex = index;

    hooks[currentIndex] = hooks[currentIndex] || initialState;

    index++;

    function dispatch(action: unknown) {
      hooks[currentIndex] = reducer(hooks[currentIndex], action);
      scheduleReRender();
    }

    return [hooks[currentIndex], dispatch] as const;
  }
})

// const useMemo = (cb: () => void, dependencyArray: unknown[]) => {
//   const currentIndex = index;

//   const hasChanged = dependencyArray.some((item, i) => {
//     if (hooks[currentIndex]) {
//       return item !== hooks[currentIndex].dep[i];
//     }
//     return false;
//   });

//   if (hasChanged || !hooks[currentIndex]) hooks[currentIndex] = { dep: dependencyArray, value: cb() };

//   index++;

//   return hooks[currentIndex].value;
// }

// const useRef = (initialValue) => {
//   const currentIndex = index;
//   hooks[currentIndex] = { current: initialValue };
//   index++;
//   return hooks[currentIndex];
// }

// const createContext = (defaultValue) => {
//   const currentIndex = contextIndex;
//   contexts[currentIndex] = defaultValue;
//   contextIndex++;

//   return {
//     __currentValue: currentIndex,
//     Provider: ({ value, children }) => {
//       contexts[currentIndex] = value;
//       return children[0];
//     }
//   };
// }

// const useContext = (context) => {
//   return contexts[context.__currentValue];
// }


export {
  dispatch,
  scheduleReRender
}
