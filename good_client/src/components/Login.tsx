import React, { useState } from 'react';
import { apiRequest } from '../api';
import { AuthFormProps } from './AuthForm';

const Login: React.FC<AuthFormProps> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await apiRequest({
      data: { email, password },
      endpoint: '/auth/login',
      method: 'POST',
    })

    const data = response.data;

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
