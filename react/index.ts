const isText = (item) => typeof item === 'string' || typeof item === 'number';

const createTextElement = (text: string) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: isText(text) ? text : '',
      children: [],
    },
  };
};

const createElement = (
  type: keyof HTMLElementTagNameMap | (() => void),
  props: {
    style: Record<string, string>,
    onClick: () => void,
  },
  ...children
) => {
  const element = {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };

  return element;
};

const hooks = [];
const contexts = [];
let index = 0;
let contextIndex = 0;
const useState = (initialValue) => {
  const currentIndex = index;
  hooks[currentIndex] = hooks[currentIndex] || initialValue;
  index++;
  const setState = (newValue) => {
    if (typeof newValue === "function") {
      hooks[currentIndex] = newValue(hooks[currentIndex]);
    } else {
      hooks[currentIndex] = newValue;
    }

    reRender();
  }

  return [hooks[currentIndex], setState];
}

const useReducer = (reducer, initialValue) => {
  const currentIndex = index;
  hooks[currentIndex] = hooks[currentIndex] || initialValue;
  index++;
  const dispatch = (action) => {
    hooks[currentIndex] = reducer(hooks[currentIndex], action);
    reRender();
  }

  return [hooks[currentIndex], dispatch];
}

const useEffect = (cb: () =>void, dependencyArray: unknown[]) => {
  const currentIndex = index;

  const hasChanged = dependencyArray.some((item, i) => {
    if (hooks[currentIndex]) {
      return item !== hooks[currentIndex][i];
    }
    return false;
  });


  if (hasChanged || !hooks[currentIndex]) cb();


  hooks[currentIndex] = dependencyArray;
  index++;
}

const useMemo = (cb: () => void, dependencyArray: unknown[]) => {
  const currentIndex = index;

  const hasChanged = dependencyArray.some((item, i) => {
    if (hooks[currentIndex]) {
      return item !== hooks[currentIndex].dep[i];
    }
    return false;
  });

  if (hasChanged || !hooks[currentIndex]) hooks[currentIndex] = { dep: dependencyArray, value: cb() };

  index++;

  return hooks[currentIndex].value;
}

const useRef = (initialValue) => {
  const currentIndex = index;
  hooks[currentIndex] = { current: initialValue };
  index++;
  return hooks[currentIndex];
}

const createContext = (defaultValue) => {
  const currentIndex = contextIndex;
  contexts[currentIndex] = defaultValue;
  contextIndex++;

  return {
    __currentValue: currentIndex,
    Provider: ({ value, children }) => {
      contexts[currentIndex] = value;
      return children[0];
    }
  };
}

const useContext = (context) => {
  return contexts[context.__currentValue];
}

const createNode = (element) => {
  if (element.type === "TEXT_ELEMENT") {
    return document.createTextNode(element.props.nodeValue);
  }
  return document.createElement(element.type);
}

const render = (element, container?: HTMLElement) => {
  if (typeof element.type === 'function') {
    return render(element.type(element.props), container)
  }
  const vDOM = createNode(element);


  const fatherContainer = container || _DOM.rootContainer;

    Object.keys(element.props)
      .filter(key => key !== "children")
      .forEach(name => {
        if (name === 'ref') {
          element.props[name].current = vDOM
        }
        if (name.startsWith("on")) {
          if (name === 'onChange') {
            vDOM.addEventListener('input', (e) => {
              element.props[name](e)
            });
            setTimeout(() => vDOM.focus(), 0.1)
            return;
          }
          vDOM.addEventListener(name.substring(2).toLowerCase(), element.props[name]);
        }else if(name === "style") {
          // console.log(vDOM.style, element.props[name], vDOM[name])
          Object.assign(vDOM.style, element.props[name]);
        } else {
          vDOM[name] = element.props[name];
        }
      });


    element.props.children.forEach(child => {
      if (Array.isArray(child)) {
        child.forEach(c => render(c, vDOM));
      } else {
        render(child, vDOM);
      }
    });


  fatherContainer.appendChild(vDOM);
}

const _DOM = {
  rootContainer: null,
  virtualDOM: null,
}

let renders = 1;
const reRender = () => {
  const timer = 're-render -----> ' + renders++;
  console.time(timer);
  index = 0;
  dispatchRender();
  console.timeEnd(timer);
  console.log(hooks)

}

const dispatchRender = () => {
  _DOM.rootContainer.innerHTML = "";
  render(createType(_DOM.virtualDOM), _DOM.rootContainer);
}


const createType = (element) => {
  if (typeof element.type === 'function') return element.type(element)
  return element;
};


const createRoot = (rootContainer: HTMLElement) => {
  _DOM.rootContainer = rootContainer;
  return {
    render: (element) => {
      _DOM.virtualDOM = element;
      const newElement = createType(element);
      render(newElement, rootContainer);
    },
  }
}

const React = {
  createElement,
  createRoot
}

export {
  createContext,
  useContext,
  useMemo,
  useState,
  useReducer,
  useEffect,
  useRef,
}

export default React;
