import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Index from './Index';
import Workspace from './queries/Workspace';
import LeftSidebar from './LeftSidebar';
import SourceSettings from './manages/SourceSettings';
import MetricSettings from './manages/MetricSettings';
import SystemSettings from './manages/SystemSettings';
import SingleDataSearch from './queries/SingleDataSearch';
import Topology from './Topology';

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
                    <Layout style={{ paddingLeft: 200, minHeight: '100vh' }}>
                        <Route exact path="/" component={Index} />
                        <Route path="/core" component={Workspace}></Route>
                        <Route path="/metric" component={MetricSettings}></Route>
                        <Route path="/singledata" component={SourceSettings}></Route>
                        <Route path="/multipledata" component={SystemSettings}></Route>
                        <Route path="/topology" component={Topology}></Route>
                    </Layout>
                </Layout>
            </Router>
        );
    }
};

export default App;
