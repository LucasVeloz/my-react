import { createElement } from "./createElement";

const __DOM: {
  virtualDom: null | ReturnType<typeof createElement>
  root: {
    element: null | HTMLElement;
    component: () => ReturnType<typeof createElement>
  }
} = {
  virtualDom: null,
  root: {
    element: null,
    component: null,
  }
}


export {
  __DOM
}
