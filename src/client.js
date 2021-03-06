import React from 'react';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import { loadComponents } from 'loadable-components';

import configureStore from './utils/configureStore';
import routes from './routes';

// Get the initial state from server-side rendering
const initialState = window.__INITIAL_STATE__;
const history = createHistory();
const store = configureStore(history, initialState);

const render = () => {
  hydrate(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          {renderRoutes(routes)}
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('react-view')
  );
};

// Load all components needed before starting rendering (loadable-components setup)
loadComponents().then(() => {
  render(routes);
});

if (module.hot) {
  // Enable webpack hot module replacement for routes
  module.hot.accept('./routes', () => {
    try {
      const nextRoutes = require('./routes').default;

      render(nextRoutes);
    } catch (error) {
      // eslint-disable-next-line
      console.error(`==> 😭  Routes hot reloading error ${error}`);
    }
  });
}
