import React from 'react';
import GlobalStyle from './styles/global';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import { AuthContextProvider } from './hooks/AuthContext';
import ToastContainer from './components/ToastContainer';

const App: React.FC = () => (
  <>
    <GlobalStyle />
    <AuthContextProvider>
      <SignIn />
    </AuthContextProvider>

    <ToastContainer />
  </>
);

export default App;
