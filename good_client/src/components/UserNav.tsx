import React from 'react';
import { apiRequest } from '../api';
import Cookie from 'js-cookie';
import { User } from '../App';

interface Props {
  onLogout: () => void;
  user: User;
}

const UserNav: React.FC<Props> = (props) => {
  const handleLogout = async () => {
    await apiRequest({
      endpoint: '/logout',
      method: 'POST',
    });
    Cookie.remove('csrf_token');
    props.onLogout();
  }

  return (
    <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
      <span>{props.user.email}</span>
      <button style={{ margin: 8, padding: 4 }} onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default UserNav;
