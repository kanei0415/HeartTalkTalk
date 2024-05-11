import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RootNavigationContainer from '@routes/containers/RootNavigationContainer';
import { Provider } from 'react-redux';
import store from '@store/store';
import { IMPPaymentData, IMPPaymentResponse } from '@libs/IMP';

declare global {
  interface Window {
    IMP: {
      init: (id?: string) => void;
      request_pay: (
        data: IMPPaymentData,
        callback: (res: IMPPaymentResponse) => void,
      ) => void;
    };
  }
}

window.IMP.init('imp56476154');

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
