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

const createElement = (type, props, ...children) => {
  const element = {
    type,
    props: {
      ...props,
      children: children.map((child) => 
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };

  
  if (typeof type === "function") {
    return type(element)
  }
  
  return element;
};

const hooks = [];
let index = 0; 
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

const render = (element, container?: HTMLElement, i=0) => {
  const timer = 'render -----> ' + i;
  const nextValue = i + 1;
  console.time(timer);
  const vDOM = element.type === "TEXT_ELEMENT" ? document.createTextNode(element.nodeValue) : document.createElement(element.type);

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
        child.forEach(c => render(c, vDOM, nextValue));
      } else {
        render(child, vDOM, nextValue);
      }
    });


  fatherContainer.appendChild(vDOM);
  index = 0;
  console.timeEnd(timer);
}

const _DOM = {
  rootContainer: null,
  virtualDOM: null,
}

const reRender = () => {
  _DOM.rootContainer.innerHTML = "";
  render(<App />);
}


const createRoot = (rootContainer: HTMLElement) => {
  _DOM.rootContainer = rootContainer;
  return {
    render,
  }
}

const React = {
  createElement,
}


const App = () => {
  const [counter, setCounter] = useState(0);
  const [users, setUsers] = useState([]);

  const removeUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
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
        {users.map(user => 
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
        )}
      </div>
    </div>
  )
}


createRoot(document.getElementById("root")).render(<App />);

