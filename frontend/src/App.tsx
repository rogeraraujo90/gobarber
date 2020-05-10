import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyle from './styles/global';
import AppContextProvider from './hooks';

import Routes from './routes';

const App: React.FC = () => (
  <BrowserRouter>
    <GlobalStyle />
    <AppContextProvider>
      <Routes />
    </AppContextProvider>
  </BrowserRouter>
);

export default App;
