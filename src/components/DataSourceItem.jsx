import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col, Select, Input, Button } from 'antd';
import get from 'lodash/get';
import Component from './Component';

const Option = Select.Option;

@observer class DataSourceItem extends Component {

    @observable.ref types = ['db', 'weblogic', 'tuxedo', '业务', '系统']
    @observable.ref fields = []
    @observable.ref indices = []

    // 需要提交保存的数据
    data = {}
    
    componentWillMount() {
        this.elastic.catIndices().then(action(indices => {
            this.indices = indices.map((index) => index.index);
        }));
    }

    onTypeChange(type) {
        this.data.category = type;
    }

    onIndexChange(index) {
        this.data.index = index;
        this.elastic.getIndices(index).then(action(result => {
            const mappings = get(result, [index, 'mappings'], {});
            const type = Object.keys(mappings)[0];

            if (type) {
                this.data.type = type;
                this.fields = Object.keys(mappings[type].properties);
            }
        }))
    }

    onKeyChange(value) {
        this.data.fields = value;
    }

    onNameChange(value) {
        this.data.name = value;
    }

    onSave() {
        this.elastic.saveSingleDataSource(this.data.name, this.data);
        this.props.onSave(this.data);
    }

    render() {
        return (
            <Row gutter={16}>
                <Col span={3} className="gutter-row">
                    <Select style={{ width: '100%' }} onChange={(value) => this.onTypeChange(value)}>
                    {
                        this.types.map((type) => {
                            return <Option value={type} key={type}>{type}</Option>
                        })
                    }
                    </Select>
                </Col>
                <Col span={3} className="gutter-row">
                    <Select style={{ width: '100%' }} onChange={(value) => this.onIndexChange(value)}>
                    {
                        this.indices.map((index) => {
                            return <Option value={index} key={index}>{index}</Option>
                        })
                    }
                    </Select>
                </Col>
                <Col span={9} className="gutter-row">
                    <Select
                        mode="tags"
                        placeholder="Please select"
                        defaultValue={[]}
                        style={{ width: '100%' }}
                        onChange={(value) => this.onKeyChange(value)}
                    >
                    {
                        this.fields.map((field) => {
                            return <Option value={field} key={field}>{field}</Option>
                        })
                    }
                    </Select>
                </Col>
                <Col span={5} className="gutter-row">
                    <Input onChange={(e) => this.onNameChange(e.target.value)} />
                </Col>
                <Col span={4} className="gutter-row">
                    <Button type="primary" onClick={() => this.onSave()}>保存</Button>
                </Col>
            </Row>
        );
    }
}

export default DataSourceItem;
