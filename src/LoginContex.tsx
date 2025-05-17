// LoginContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { checkLoginStatus } from './utils/LoginStorage';

export const LoginContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
});

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const value = await checkLoginStatus();
      setIsLoggedIn(value);
    };
    fetchLoginStatus();
  }, []);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
};
