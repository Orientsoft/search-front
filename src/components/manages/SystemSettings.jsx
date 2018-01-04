import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import BaseComponent from '../BaseComponent';
import { Row, Col, Input, Button, Icon, Select, Card } from 'antd';
import SystemContent from './SystemContent';

const Option = Select.Option;

@observer class SystemSettings extends BaseComponent {
    @observable hide = false
    
    @action.bound setVisible(visible) {
        this.hide = visible;
    }
    
    render() {
        return (
            <Card className='dataSource'>
                <p className='headerManager'>系统配置:</p>
                <Button type="primary" icon="plus" onClick={() => this.setVisible(true)}>添加数据</Button>
                <SystemContent  visible={this.hide} setVisible={this.setVisible}/>
            </Card>
        )
    }
}

export default SystemSettings;
