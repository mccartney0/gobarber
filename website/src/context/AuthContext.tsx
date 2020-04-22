import React, { createContext, useCallback } from 'react';

interface AuthContextData {
  name: string;
  signIn(): void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const signIn = useCallback(() => {
    console.log('oiiiiiii');
  }, []);

  return (
    <AuthContext.Provider value={{ name: 'Caio', signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
