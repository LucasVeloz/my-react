import React, { createRoot } from './react'
import App from './src/app';

const rootElement = document.getElementById("root");

createRoot(rootElement)
  .render(<App />);
