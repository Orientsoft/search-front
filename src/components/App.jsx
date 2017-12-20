import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Workspace from './Workspace';
import LeftSidebar from './LeftSidebar';
import MultipleDataSource from './MultipleDataSource';
import SingleDataSource from './SingleDataSource';
// import createBrowserHistory from 'history/createBrowserHistory'

// const history = createBrowserHistory()

/**
 * 整体布局
 * 左侧菜单栏，右侧工作区
 */
class App extends React.Component {

    static childContextTypes = {
        store: PropTypes.object.isRequired,
        elastic: PropTypes.object.isRequired
    };

    getChildContext() {
        return this.props
    }

    render() {
        return (
            <Router>
                <Layout>
                    <LeftSidebar />
                    <Layout>
                        <Route path="/core" component={Workspace}></Route>
                        <Route path="/singledata" component={SingleDataSource}></Route>
                        <Route path="/multipledata" component={MultipleDataSource}></Route>
                    </Layout>
                </Layout>
            </Router>
        );
    }
};

export default App;
