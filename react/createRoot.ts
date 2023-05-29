import { __DOM } from "./DOM";
import { createElement } from "./createElement";
import { render } from "./render";

function createRoot(root: HTMLElement) {
  __DOM.root.element = root;
  return {
    render: function (element: ReturnType<typeof createElement>) {
      if (typeof element.type === 'function') {
        __DOM.virtualDom = element.type();
        __DOM.root.component = element.type;
      }
      render(element, root);
    },
  }
}


export {
  createRoot
}
