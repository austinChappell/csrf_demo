import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';
import { User } from '../App';

export interface AuthFormProps {
  onSuccess: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = (props) => {
  const [mode, setMmode] = useState<'login' | 'signup'>('login');

  const paragraph = mode === 'login' ? 'Need an account?' : 'Already have an account?';
  const buttonText = mode === 'login' ? 'Sign Up' : 'Login';

  const handleToggleMode = () => {
    if (mode === 'login') {
      setMmode('signup')
    } else {
      setMmode('login');
    }
  }

  return (
    <>
      {mode === 'login'
        ? <Login onSuccess={props.onSuccess} />
        : <SignUp onSuccess={props.onSuccess} />
      }

      <p>
        {paragraph}
      </p>

      <button onClick={handleToggleMode}>
        {buttonText}
      </button>
    </>
  );
}

export default AuthForm;
