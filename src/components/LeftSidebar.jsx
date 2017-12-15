import React from 'react';
import { Layout, Menu } from 'antd';
import styles from '../less/styles.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

class LeftSidebar extends React.Component {

    render() {
        return (
            <Sider style={{ overflow: 'auto', height: '100vh' }}>
                <div className={styles.logo}>
                    <span>大数据智能运维平台</span>
                </div>
                <Menu mode="inline" theme="dark">
                    <SubMenu key="top" title="Analyze">
                        <p className={styles.searchManage}>查询</p>
                        <SubMenu key="sub1" title={<span>联合查询</span>}>
                            <Menu.Item key="1">核心</Menu.Item>
                            <Menu.Item key="2">手机</Menu.Item>
                            <Menu.Item key="3">网络</Menu.Item>
                            <Menu.Item key="4">支付</Menu.Item>
                            <Menu.Item key="5">前置</Menu.Item>
                            <Menu.Item key="6">ESB</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="7">单数据源查询</Menu.Item>
                        <Menu.Item key="8">历史查询记录</Menu.Item>
                        <p className={styles.searchManage}>管理</p>
                        <Menu.Item key="9">查询管理</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        );
    }
}

export default LeftSidebar;
