import React from 'react';
import { AuthContextProvider } from './auth';
import { ToastContextProvider } from './toast';

const AppContextProvider: React.FC = ({ children }) => (
  <AuthContextProvider>
    <ToastContextProvider>{children}</ToastContextProvider>
  </AuthContextProvider>
);

export default AppContextProvider;
