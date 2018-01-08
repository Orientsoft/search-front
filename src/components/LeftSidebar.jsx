import React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import get from 'lodash/get';
import { Link } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import BaseComponent from './BaseComponent';

const { Sider } = Layout;
const { SubMenu } = Menu;

@observer class LeftSidebar extends BaseComponent {
    componentWillMount() {
        // 获取所有系统
        this.elastic.getMultipleDataSource().then(mobx.action(result => {
            this.appStore.config.systems = this.getHits(result).map(data => JSON.parse(data._source.data));
        }));
        // 获取所有指标
        this.elastic.getMetricDataSource().then(mobx.action(result => {
            this.appStore.config.metrics = this.getHits(result).map(data => JSON.parse(data._source.data));
        }));
        // 获取所有数据源
        this.elastic.getSingleDataSource().then(mobx.action(result => {
            this.appStore.config.sources = this.getHits(result).reduce((sources, data) => {
                sources[data._source.name] = JSON.parse(data._source.fields)
                return sources;
            }, {});
        }));
    }

    onMenuChanged({ item, key }) {
        const system = this.appStore.config.systems[key];
        let metrics = [];

        if (system) {
            this.appStore.selectedConfig.system = system;
            for (let i = 0; i < system.metrics.length; i++) {
                const _metrics = this.appStore.config.metrics.filter(metric => metric.name === system.metrics[i]);

                if (_metrics.length) {
                    metrics = metrics.concat(_metrics);
                }
            }
            this.appStore.selectedConfig.metrics = metrics;
            this.appStore.selectedConfig.sources = system.sources.map(source => this.appStore.config.sources[source]);
            console.log('selectedConfig: ', mobx.toJS(this.appStore.selectedConfig));
        }
    }

    render() {
        return (
            <Sider style={{ overflow: 'auto', minHeight: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 9 }}>
                <div className="logo">
                    <span>大数据智能运维平台</span>
                </div>
                <Menu mode="inline" theme="dark" onClick={(item) => this.onMenuChanged(item)}>
                    <SubMenu key="top01" title="系统拓扑">
                        <Menu.Item key="topology" className="topology"><Link to="/topology">拓扑分析</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu key="top02" title="数据分析">
                        <Menu.Item key="1" className="searchManage">查询</Menu.Item>
                        <SubMenu key="sub1" title={<span>系统查询</span>}>
                            {this.appStore.config.systems.map((system, key) => {
                                return (<Menu.Item key={key}><Link to="/core">{system.name}</Link></Menu.Item>)
                            })}
                        </SubMenu>

                        {/* <Menu.Item key="singledataSearch"><Link to="/singledataSearch">单数据源查询</Link></Menu.Item> */}
                        <Menu.Item key="historySearch"><Link to="/historySearch">历史查询记录</Link></Menu.Item>
                        <Menu.Item key="2" className="searchManage">管理</Menu.Item>
                        <Menu.Item key="singledata"><Link to="/singledata">数据源配置</Link></Menu.Item>
                        <Menu.Item key="metric"><Link to="/metric">指标配置</Link></Menu.Item>
                        <Menu.Item key="multipledata"><Link to="/multipledata">系统配置</Link></Menu.Item>
                        <Menu.Item key="topo"><Link to="/topo">拓扑配置</Link></Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        );
    }
}

export default LeftSidebar;
