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

const memo = (Component) => {
  // a fazer
  return (props) => {
    return Component(props);
  }
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
        if (name.startsWith("on")) {
          vDOM.addEventListener(name.substring(2).toLowerCase(), element.props[name]);
        }else if(name === "style") {
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
  hooks.length
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
}

const navigationContext = createContext({});

const NavigationContainer = ({ children = [] }) => {
  const screens = children.map(item => item.props);
  const [activeIndex, setActiveIndex] = useState(0);
  const Item = screens[activeIndex].component;

  const navigate = (name) => {
    const currentIndex = screens.findIndex(item => item.name === name);
    setActiveIndex(currentIndex);
  }

  return (
    <navigationContext.Provider value={{ navigate }}>
      <Item navigate={navigate} />
    </navigationContext.Provider>
  )
}

const ScreenComponent = (_:{ name, component }) => {
  return null;
}

const Link = ({ to }) => {
  const { navigate } = useContext(navigationContext);
  const onClick = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', to);
    navigate(to);
  }

  return <a href={to} onClick={onClick} >{to}</a>
}


const Card = memo(({ user, removeUser }) => {
  return (
    <button onClick={() => removeUser(user.id)}>
      <img
        src={user.avatar_url}
        loading="lazy"
        style={{
          width: '100px',
          height: '100px',
        }}
        />
      <p>{user.login}</p>
    </button>
  )
});

const First = () => {
  const [counter, setCounter] = useState(0);
  const [users, setUsers] = useState([]);

  const value = useMemo(() => {
    return Array.from({ length: 100000000 }).fill(1).reduce((acc, item) => acc + item, 0);
  }, [counter]);

  const removeUser = (id) => {
    setUsers(oldState=> oldState.filter(user => user.id !== id));
  }

  useEffect(() => {
    document.title = `Você clicou ${counter} vezes`;
  }, [counter])

  useEffect(() => {
    (async () => {
      const me = await fetch('https://api.github.com/users/LucasVeloz');
      const response = await fetch('https://api.github.com/users')
      setUsers([await me.json(), ...(await response.json())]);
    })()
  }, [])


  return (
    <div>
      <Link to={`second ${value}`} />
      <button
        onClick={() => setCounter(oldState => oldState + 1)}
        style={{
          width: '100%',
          'background-color': 'red',
        }}
      >
        {counter}
      </button>
      <div style={{
          display: 'flex',
          'flex-wrap': 'wrap',
      }}>
        {users.map(user => <Card user={user} removeUser={removeUser} />)}
      </div>
    </div>
  )
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { counter: state.counter + 1 };
    case 'decrement':
      return { counter: state.counter - 1 };
    default:
  }
}
const Second = () => {
  const [state, dispatcher] = useReducer(reducer, { counter: 0 });


  return (
    <div>
      <h1>Second</h1>
      <Link to="first" />
      <button
        onClick={() => dispatcher({ type: 'increment' })}
      >
        Count: {state.counter}
      </button>
    </div>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <ScreenComponent name="first" component={First} />
      <ScreenComponent name="second" component={Second} />
    </NavigationContainer>
  )
}

createRoot(document.getElementById("root")).render(<App />);
