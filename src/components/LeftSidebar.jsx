import React from 'react';
import { Link } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import Component from './Component';

const { Sider } = Layout;
const { SubMenu } = Menu;

class LeftSidebar extends Component {

    render() {
        return (
            <Sider style={{ overflow: 'auto', minHeight: '100vh' }}>
                <div className="logo">
                    <span>大数据智能运维平台</span>
                </div>
                <Menu mode="inline" theme="dark">
                    <SubMenu key="top" title="Analyze">
                        <p className="searchManage">查询</p>
                        <SubMenu key="sub1" title={<span>联合查询</span>}>
                            <Menu.Item key="1"><Link to="/core">核心</Link></Menu.Item>
                            <Menu.Item key="2">手机</Menu.Item>
                            <Menu.Item key="3">网络</Menu.Item>
                            <Menu.Item key="4">支付</Menu.Item>
                            <Menu.Item key="5">前置</Menu.Item>
                            <Menu.Item key="6">ESB</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="7"><Link to="/singledataSearch">单数据源查询</Link></Menu.Item>
                        <Menu.Item key="8"><Link to="/historySearch">历史查询记录</Link></Menu.Item>
                        <p className="searchManage">管理</p>
                        <Menu.Item key="9"><Link to="/singledata">单数据源配置</Link></Menu.Item>
                        <Menu.Item key="10"><Link to="/multipledata">多数据源配置</Link></Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        );
    }
}

export default LeftSidebar;
