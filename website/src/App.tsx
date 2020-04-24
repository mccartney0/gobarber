import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import GlobalStyle from './styles/global';

import AppProvder from './hooks';

import Routes from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <AppProvder>
        <Routes />
      </AppProvder>

      <GlobalStyle />
    </Router>
  );
};

export default App;
