import React, { useState, useEffect } from 'react';
import Cookie from 'js-cookie';

import './App.css';
import AuthForm from './components/AuthForm';
import UserNav from './components/UserNav';
import { apiRequest } from './api';

export interface User {
  id: number;
  email: string;
}

function App() {
  const [isGettingUser, setIsGettingUser] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState<{ id: number; label: string }[]>([]);
  
  const getTodos = async () => {
    const response = await apiRequest({ endpoint: '/todos' })
    
    setTodos(response.data);
  }

  const getMe = async () => {
    try {
      const response = await apiRequest({
        endpoint: '/auth/me',
      });
  
      const { data } = response;
  
      if (data) {
        setUser(data as User);
      }
    } finally {
      setIsGettingUser(false);
    }
  }

  const addTodo = async () => {
    await apiRequest({
      data: { label: value },
      endpoint: '/todos',
      method: 'POST',
    });

    setValue('');

    getTodos();
  }

  const handleLogout = async () => {
    await apiRequest({
      endpoint: '/auth/logout',
      method: 'POST',
    });
    Cookie.remove('csrf_token');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addTodo();
  }

  useEffect(() => {
    if (user) {
      getTodos();
    }
  }, [user?.id]);

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    setTodos([]);
  }, [user?.id]);

  useEffect(() => {
    if (!isGettingUser && !user) {
      handleLogout();
    }
  }, [isGettingUser]);

  if (isGettingUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="App">
      {user && (
        <UserNav
          onLogout={() => setUser(null)}
          user={user}
        />
      )}

      <header className="App-header">
        {user ? (
          <>
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
          </>
        ) : (
          <AuthForm onSuccess={setUser} />
        )}
      </header>
    </div>
  );
}

export default App;
