const createTextElement = (text: string) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
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
    return type(element);
  }
  
  return element;
};

const reRender = () => {
  const container = document.getElementById("root");
  container.innerHTML = "";
  index = 0;
  render(<App />, document.querySelector("#root"));
}

const hooks = [];
let index = 0; 
const useState = (initialValue) => {
  const currentIndex = index;
  hooks[currentIndex] = hooks[currentIndex] || initialValue;
  index++;
  const setState = (newValue) => {
    hooks[currentIndex] = newValue;

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


const render = (element, container) => {
  const vDOM = element.type === "TEXT_ELEMENT" ? document.createTextNode(element.nodeValue) : document.createElement(element.type);

    Object.keys(element.props)
      .filter(key => key !== "children")
      .forEach(name => {
        vDOM[name] = element.props[name];
      });


    element.props.children.forEach(child => {
      render(child, vDOM);
    });


  container.appendChild(vDOM);
}

const React = {
  createElement,
}


const App = () => {
  const [counter, setCounter] = useState(0);


  useEffect(() => {
    document.title = (`You clicked ${counter} times`);
  }, []);

  return (
    <div>
      <h1>hello world</h1>
      <button onclick={()=>setCounter(counter+1)}>teste</button>
      <h1>cliques {counter}</h1>
    </div>
  )
}


render(<App />, document.querySelector("#root"));