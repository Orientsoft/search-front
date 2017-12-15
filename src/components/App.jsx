import React from 'react';
import { Layout } from 'antd';
import Workspace from './Workspace';

/**
 * 整体布局
 * 左侧菜单栏，右侧工作区
 */
export default () => (
    <Layout>
        <Layout.Sider>Sider</Layout.Sider>
        <Layout>
            <Workspace />
        </Layout>
    </Layout>
);
