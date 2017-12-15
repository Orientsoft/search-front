import React from 'react';
import { Layout } from 'antd';
import Workspace from './Workspace';
import LeftSidebar from './LeftSidebar';

/**
 * 整体布局
 * 左侧菜单栏，右侧工作区
 */
export default () => (
    <Layout>
        <LeftSidebar />
        <Layout>
            <Workspace />
        </Layout>
    </Layout>
);
