import { createElement } from "./createElement";

function createNode(element: ReturnType<typeof createElement>) {
  if (typeof element === 'string' || typeof element === 'number') {
    return document.createTextNode(element);
  }

  return document.createElement(element.type.toString());
}

export {
  createNode
}
