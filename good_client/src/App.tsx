import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import './App.css';

function App() {
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState<{ id: number; label: string }[]>([]);
  
  const getTodos = async () => {
    const response = await fetch('http://localhost:4000/todos', { credentials: 'include' });
    const data = await response.json();

    setTodos(data);
  }

  const addTodo = async () => {
    const response = await fetch(
      'http://localhost:4000/todos',
      {
        body: JSON.stringify({
          label: value,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': Cookies.get('csrf_cookie') ?? '',
        },
        method: 'POST',
      }
    );
    await response.json();

    setValue('');

    getTodos();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addTodo();
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />

          <input type="submit" value="add todo" />
        </form>

        <h2>Todos</h2>
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>
              {todo.label}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
