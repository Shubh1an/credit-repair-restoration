import './assets/styles/common.scss';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { setAutoFreeze } from 'immer';
import { BrowserRouter as Router } from 'react-router-dom';
import 'toastr/build/toastr.min.css'
import toastr from 'toastr';

import { store } from './store/store';
import environment from './environments/environment';
import App from './app';
import { NotFoundComponent } from './screens/not-found';
import { UrlUtils } from './utils/http-url.util';
import { HTTPInterceptor } from './core/http-interceptors';

if (environment.env === 'PROD') {
  setAutoFreeze(false); // by deault its auto-freeze
}

function LoadApplication() {
  const [baseURL] = useState(UrlUtils.getPartnerKey());
  useEffect(() => {
    toastr.options = {
      positionClass: 'toast-top-full-width',
      hideDuration: 300,
      timeOut: 5000,
      preventDuplicates: true
    }
    toastr.clear()
  }, []);
  return (
    UrlUtils.isPartnerKeyInvalid()
      ?
      <NotFoundComponent />
      :
      <Provider store={store}>
        <React.StrictMode>
          <Router basename={baseURL}>
            <HTTPInterceptor />
            <App />
          </Router>
        </React.StrictMode>
      </Provider>
  );
}

ReactDOM.render(
  <LoadApplication />,
  document.getElementById('root')
);
