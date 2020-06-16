import React, { useState } from 'react';
import Cookie from 'js-cookie';
import { apiRequest } from '../api';
import { AuthFormProps } from './AuthForm';

const Login: React.FC<AuthFormProps> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await apiRequest({
      data: { email, password },
      endpoint: '/login',
      method: 'POST',
    })

    const data = response.data;
    const csrfToken = response.headers['x-csrf-token'];

    Cookie.set('csrf_token', csrfToken);

    props.onSuccess(data);
  }

  return (
    <>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input 
          onChange={e => setEmail(e.target.value)} 
          placeholder="email"
          value={email}
        />
        <input 
          onChange={e => setPassword(e.target.value)} 
          placeholder="password"
          type="password"
          value={password}
        />
        <input type="submit" value="Login" />
      </form>
    </>
  )
}

export default Login;
