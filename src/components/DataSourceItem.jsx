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
    @observable dataSource = []
    @observable enableEdit = []

    // 需要提交保存的数据
    data = {}
    name = ''

    componentWillMount() {
        this.elastic.getSingleDataSource().then(result => {
            this.dataSource = get(result, 'hits.hits', []).map(data => data._source);
            this.appStore.singleDataNames = this.dataSource.map(data => data.name);
            this.enableEdit = Array(this.dataSource.length);
        });
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
        // this.props.onSave(this.data);
        this.dataSource.push(this.data);
        this.appStore.singleDataNames = this.dataSource.map(data => data.name);
        this.enableEdit.push(false);
    }

    onSaveChange(key) {
        console.log("this.data", this.data)
        this.elastic.updateSingleDataSource(this.data.name, this.data);
        this.enableEdit[key] = false;
    }

    render() {
        return (
            <div>
                <div className='contentManager'>
                    <Row gutter={16}>
                        <Col span={3} className="gutter-row">类型:</Col>
                        <Col span={3} className="gutter-row">数据源:</Col>
                        <Col span={9} className="gutter-row">字段选择:</Col>
                        <Col span={5} className="gutter-row">名称:</Col>
                    </Row>

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
                </div>

                <div className='contentManager'>
                    {this.dataSource.map((item, key) => {
                        return (<Row gutter={16} key = {key}>
                            <Col span={3} className="gutter-row">
                                <Select defaultValue={item.category} style={{ width: '100%' }} disabled={!this.enableEdit[key]} onChange={(value) => this.onTypeChange(value)}>
                                    {this.types.map((item) => {
                                        return <Option value={item} key={item}>{item}</Option>
                                    })}
                                </Select>
                            </Col>
                            <Col span={3} className="gutter-row">
                                <Select defaultValue={item.index} style={{ width: '100%' }} disabled={!this.enableEdit[key]} onChange={(value) => this.onIndexChange(value)}>
                                    {this.indices.map((item) => {
                                        return <Option value={item} key={item}>{item}</Option>
                                    })}
                                </Select>
                            </Col>
                            <Col span={9} className="gutter-row">
                                <Select
                                    mode="tags"
                                    placeholder="Please select"
                                    defaultValue={item.fields}
                                    style={{ width: '100%' }}
                                    onChange={(value) => this.onKeyChange(value)}
                                    disabled={!this.enableEdit[key]}
                                >
                                    {this.fields.map((field) => {
                                        return <Option value={field} key={field}>{field}</Option>
                                    })}
                                </Select>
                            </Col>
                            <Col span={5} className="gutter-row">
                                <Input defaultValue={item.name} disabled onChange={(e) => this.onNameChange(e.target.value)} />
                            </Col>
                            <Col span={4} className="gutter-row">
                                <Button disabled={!this.enableEdit[key]} onClick={() => this.onSaveChange(key, item.name)}>保存</Button>
                                <Button onClick={() => this.onEditSource(key, item.name)} >编辑</Button>
                                <Button onClick={() => this.onDeleteSource(key)}>删除</Button>
                            </Col>
                        </Row>)
                    })}
                </div>
            </div>
        );
    }

    @action.bound onItemSave(data) {
        this.dataSource.push(data);
        this.enableEdit.push(false);
    }

    @action onDeleteSource(key) {
        const source = this.dataSource.splice(key, 1)[0];
        this.enableEdit[key] = false;
        this.elastic.deleteSingleDataSource(source.name);
    }

    @action onEditSource(key, name) {
        this.name = name
        for (var i = 0; i < this.dataSource.length; i++) {
            if (name == this.dataSource[i].name) {
                this.data = this.dataSource[i]
            }
        }
        // confirm({
        //     title: 'edit',
        //     content: 'Are you sure to edit this data ?',
        //     // onOk: () => { this.enableEdit[key] = true; },
        //     // onCancel: () => { }
        //     onOk() {
        //         console.log('OK');
        //     },
        //     onCancel() {
        //         console.log('Cancel');
        //     },
        // })
        this.enableEdit[key] = true;
    }
}

export default DataSourceItem;
