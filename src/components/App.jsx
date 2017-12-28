import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Index from './Index';
import Workspace from './Workspace';
import LeftSidebar from './LeftSidebar';
import MultipleDataSource from './MultipleDataSource';
import SingleDataSource from './SingleDataSource';
import MetricSetting from './MetricSetting';
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
                        <Route exact path="/" component={Index} />
                        <Route path="/core" component={Workspace}></Route>
                        <Route path="/metric" component={MetricSetting}></Route>
                        <Route path="/singledata" component={SingleDataSource}></Route>
                        <Route path="/multipledata" component={MultipleDataSource}></Route>
                    </Layout>
                </Layout>
            </Router>
        );
    }
};

export default App;
