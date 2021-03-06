import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface LoggedUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface SessionData {
  token: string;
  loggedUser: LoggedUser;
}

interface Credentials {
  email: string;
  password: string;
}

interface AuthContextData {
  loggedUser: LoggedUser;
  signIn(credentials: Credentials): Promise<void>;
  signOut(): void;
  isAuthenticated(): boolean;
  updateUser(user: LoggedUser): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthContextProvider: React.FC = ({ children }) => {
  const [sessionData, setSessionData] = useState<SessionData>(() => {
    const token = sessionStorage.getItem('@GoBarber:token');
    const loggedUser = sessionStorage.getItem('@GoBarber:loggedUser');

    if (token && loggedUser) {
      api.defaults.headers = {
        Authorization: `Bearer ${token}`,
      };

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

  const updateUser = useCallback(
    (user: LoggedUser) => {
      setSessionData({
        token: sessionData.token,
        loggedUser: user,
      });

      sessionStorage.setItem('@GoBarber:loggedUser', JSON.stringify(user));
    },
    [sessionData.token]
  );

  const isAuthenticated = useCallback(() => {
    return !!sessionData.loggedUser;
  }, [sessionData.loggedUser]);

  return (
    <AuthContext.Provider
      value={{
        loggedUser: sessionData.loggedUser,
        signIn,
        signOut,
        isAuthenticated,
        updateUser,
      }}
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
