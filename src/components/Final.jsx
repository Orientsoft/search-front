import React from 'react';
// import { Router, Route,  IndexRoute,Switch } from 'react-router'
// import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Switch, Route,Router } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import App from './App';
import Workspace from './Workspace';
import LeftSidebar from './LeftSidebar';
import MultipleDataSource from './MultipleDataSource';
import SingleDataSource from './SingleDataSource';
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory()

class Final extends React.Component {

    // static childContextTypes = {
    //     store: PropTypes.object.isRequired,
    //     elastic: PropTypes.object.isRequired
    // };

    // getChildContext() {
    //     return this.props
    // }

    render() {
        return (
            <Router history={history}>
                <Route path="/" component={App}>
                    {/* <IndexRoute component={Workspace}></IndexRoute> */}
                    <Route path="/singledata" component={SingleDataSource}></Route>
                    <Route path="/multipledata" component={MultipleDataSource}></Route>
                </Route>
            </Router>
        );
    }
};

export default Final;
