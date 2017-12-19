import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';
import stores from './stores';
import elastic from './services/elastic';
import './less/styles.less';

// wrap App in AppContainer to support react hot loader
const render = () => {
    ReactDOM.render(
        <AppContainer>
            <App store={stores} elastic={elastic} />
        </AppContainer>,
        document.getElementById('mobx_container')
    );
};

render();

// webpack hot module replacement api
if (module.hot) {
    module.hot.accept('./components/App', render());
}
