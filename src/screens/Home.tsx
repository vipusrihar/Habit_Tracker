import React from 'react';
import { useAuth } from '../AuthContex';

const Home: React.FC = () => {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <div>
      <h1>{isLoggedIn ? 'You are logged in' : 'You are not logged in'}</h1>
      <button onClick={isLoggedIn ? logout : login}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  );
};

export default Home;
