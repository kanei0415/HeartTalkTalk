import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RootNavigationContainer from '@routes/containers/RootNavigationContainer';
import { Provider } from 'react-redux';
import store from '@store/store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <RootNavigationContainer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
