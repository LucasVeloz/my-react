import { createElement } from "./createElement";
import { createNode } from "./createNode";

function render(element: ReturnType<typeof createElement>, container: HTMLElement | Text) {
  if (typeof element.type === 'function') {
    render(element.type(), container)
    return;
  }

  const htmlElement = createNode(element);


  if (element.props) {
    Object.keys(element.props)
      .filter(key => key !== 'children')
      .forEach(key => {
        htmlElement[key.toLocaleLowerCase()] = element.props[key]
      })
  }


  element.props?.children.forEach(child => {
    if (typeof child === 'boolean') return;
    if (Array.isArray(child)) {
      child.forEach(c => render(c, htmlElement))
      return;
    }
    render(child, htmlElement)
  })

  container.appendChild(htmlElement)
}


export {
  render
}
