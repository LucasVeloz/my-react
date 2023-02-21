import React, { useState } from '../react';
import { Request } from './request';
import { Todo } from './todo';

export default function App() {
  const [choice, setChoice] = useState('request');
  console.log(choice)
  return (
    <div>
      <h1>Esse site usa meu próprio react, usando um primitivo stack renderer</h1>
      <Todo />
      <Request />
    </div>
  )
}
