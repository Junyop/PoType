import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import TypeSelectorModeProvider from './providers/TypeSelectorModeProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <TypeSelectorModeProvider>
        <App />
      </TypeSelectorModeProvider>
    </Provider>
  </React.StrictMode>
);
