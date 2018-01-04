import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Card } from 'antd';
import BaseComponent from '../BaseComponent';
import TopologyContent from './TopologyContent';

@observer class TopologySettings extends BaseComponent {
    @observable hide = false
    
    @action.bound setVisible(visible) {
        this.hide = visible;
    }

    render() {
        return (
            <Card className='dataSource'>
                <p className='headerManager'>定义拓扑：</p>
                <Button type="primary" icon="plus" onClick={() => this.setVisible(true)}>添加数据</Button>
                <TopologyContent visible={this.hide} setVisible={this.setVisible} />
            </Card>
        );
    }
}

export default TopologySettings;
