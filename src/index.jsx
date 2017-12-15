import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';
import stores from './stores';

// wrap App in AppContainer to support react hot loader
const render = () => {
    ReactDOM.render(
        <AppContainer>
            <App store={stores} />
        </AppContainer>,
        document.getElementById('mobx_container')
    );
};

render();

// webpack hot module replacement api
if (module.hot) {
    module.hot.accept('./components/App', render());
}
