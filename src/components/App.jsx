import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Workspace from './Workspace';
import LeftSidebar from './LeftSidebar';

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
            <Layout>
                <LeftSidebar />
                <Layout>
                    <Workspace />
                </Layout>
            </Layout>
        );
    }
};

export default App;
