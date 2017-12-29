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
    @observable hide = 'none'
    
    onAddData() {
        this.hide = 'block'
    }
    
    render() {
        return (
            <Card className='dataSource'>
                <p className='headerManager'>定义多数据源：</p>
                <Button type="primary" icon="plus" onClick={() => this.onAddData()}>添加数据</Button>
                <SystemContent  add = {this.hide}/>
            </Card>
        )
    }
}

export default SystemSettings;
