import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import get from 'lodash/get';
import { Link } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import BaseComponent from './BaseComponent';

const { Sider } = Layout;
const { SubMenu } = Menu;

@observer class LeftSidebar extends BaseComponent {
    singledataNames = ['db', 'weblogic', 'tuxedo', '业务', '系统']
    @observable selectedName = ''

    componentWillMount() {
        this.elastic.getMultipleDataSource().then(result => {
            this.appStore.multipleDataNames = get(result, 'hits.hits', []).map(data => data._source.name);
            // this.appStore.singleDataType = this.singledataNames[0]
            // this.selectedName = this.appStore.multipleDataNames[0]
            // console.log('this.selectedName',this.selectedName)
        });
    }
    onMenuChange (e){
        this.selectedName = e.target.dataset.name
        console.log('sss',e.target.dataset.name)
    //    this.appStore.singleDataType = e
    }
    

    render() {
        return (
            <Sider style={{ overflow: 'auto', minHeight: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 9 }}>
                <div className="logo">
                    <span>大数据智能运维平台</span>
                </div>
                <Menu mode="inline" theme="dark">
                    <SubMenu key="top01" title="系统拓扑">
                        <Menu.Item key="topology" className="topology"><Link to="/topology">拓扑分析</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu key="top02" title="数据分析">
                        <Menu.Item key="1" className="searchManage">查询</Menu.Item>
                        <SubMenu key="sub1" title={<span>系统查询</span>}>
                            {this.appStore.multipleDataNames.map((item, key) => {
                                return (<Menu.Item key={key} ><Link to="/core">{item}</Link></Menu.Item>)
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
