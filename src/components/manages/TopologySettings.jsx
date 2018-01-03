import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { Row, Col, Input, Button, Icon, Select, Card } from 'antd';
import BaseComponent from '../BaseComponent';
import DataSourceItem from './DataSourceItem';

const Option = Select.Option;

@observer class SourceSettings extends BaseComponent {
    @observable hide = 'none'
    
    onAddData() {
        this.hide = 'block'
    }

    render() {
        return (
            <Card className='dataSource'>
                <p className='headerManager'>定义单数据源：</p>
                <Button type="primary" icon="plus" onClick={() => this.onAddData()}>添加数据</Button>
                <DataSourceItem add={this.hide} />
            </Card>
        );
    }
}

export default SourceSettings;
