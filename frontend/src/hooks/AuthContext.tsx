import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface SessionData {
  token: string;
  loggedUser: object;
}

interface Credentials {
  email: string;
  password: string;
}

interface AuthContextData {
  loggedUser: object;
  signIn(credentials: Credentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthContextProvider: React.FC = ({ children }) => {
  const [sessionData, setSessionData] = useState<SessionData>(() => {
    const token = sessionStorage.getItem('@GoBarber:token');
    const loggedUser = sessionStorage.getItem('@GoBarber:loggedUser');

    if (token && loggedUser) {
      return { token, loggedUser: JSON.parse(loggedUser) };
    }

    return {} as SessionData;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user: loggedUser } = response.data;

    sessionStorage.setItem('@GoBarber:token', token);
    sessionStorage.setItem('@GoBarber:loggedUser', JSON.stringify(loggedUser));

    setSessionData({ token, loggedUser });
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.clear();
    setSessionData({} as SessionData);
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedUser: sessionData.loggedUser, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider.');
  }

  return context;
};

export { AuthContextProvider, useAuth };
