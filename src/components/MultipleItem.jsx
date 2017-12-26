import React from 'react';
import { observable, computed, action } from 'mobx';
import { Row, Col, Select, Input, Button, Modal } from 'antd';
import get from 'lodash/get';
import Component from './Component';

const Option = Select.Option;
const confirm = Modal.confirm;

class DataSourceItem extends Component {

    @observable.ref fields = []
    @observable dataSources = []
    @observable enableEdit = []

    @observable originname = ''
    @observable originSources = []

    // 需要提交保存的数据
    data = {}
    name = ''

    componentWillMount() {
        this.elastic.getMultipleDataSource().then(result => {
            this.dataSources = get(result, 'hits.hits', []).map(data => data._source);
            this.appStore.multipleDataNames = get(result, 'hits.hits', []).map(data => data._source.name);
            this.enableEdit = Array(this.dataSources.length);
        });

        // this.fields = this.appStore.singleDataNames
        this.elastic.getSingleDataSource().then(result => {
            this.fields = get(result, 'hits.hits', []).map(data => data._source.name);
            // this.enableEdit = Array(this.dataSources.length);
        });
    }


    onKeyChange(value) {
        this.data.fields = value;
        this.originSources = value
    }
    onEditKey(value) {
        this.data.fields = value;
    }

    onNameChange(value) {
        this.data.name = value;
        this.originname = value
    }

    onSave() {
        this.elastic.saveMultipleDataSource(this.data.name, this.data);
        // this.props.onSave(this.data);
        this.dataSources.push(this.data);
        this.enableEdit.push(false);
        this.originSources = []
        this.originname = ''
        this.appStore.multipleDataNames.push(this.data.name);
    }

    onSaveChange(key, name) {
        this.elastic.updateMultipleDataSource(this.data.name, this.data);
        this.enableEdit[key] = false;
    }

    render() {
        return (
            <div>
                <div className='contentManager'>
                    <Row gutter={16}>
                        <Col span={5} className="gutter-row">名称:</Col>
                        <Col span={12} className="gutter-row">数据源:</Col>
                    </Row>

                    <Row gutter={16} style={{ display: this.props.add }}>
                        <Col span={4} className="gutter-row">
                            <Input defaultValue=" " onChange={(e) => this.onNameChange(e.target.value)} value={this.originname} />
                        </Col>

                        <Col span={15} className="gutter-row">
                            <Select
                                mode="tags"
                                placeholder="Please select"
                                value={this.originSources.slice()}
                                style={{ width: '100%' }}
                                onChange={(value) => this.onKeyChange(value)}
                            >
                                {this.fields && this.fields.map((item, key) => {
                                    return <Option value={item} key={key}>{item}</Option>
                                })}
                            </Select>
                        </Col>

                        <Col span={5} className="gutter-row">
                            <Button type="primary" onClick={(e) => this.onSave(e)}>保存</Button>
                        </Col>
                    </Row>
                </div>
                <div className='contentManager'>
                    {this.dataSources.map((item, key) => {
                        return (<Row gutter={16}>
                            <Col span={4} className="gutter-row">
                                <Input value={item.name} disabled />
                            </Col>

                            <Col span={15} className="gutter-row">
                                <Select
                                    mode="tags"
                                    placeholder="Please select"
                                    value={item.fields.slice()}
                                    style={{ width: '100%' }}
                                    disabled={!this.enableEdit[key]}
                                    onChange={(value) => this.onEditKey(value)}
                                >
                                    {this.fields && this.fields.map((item, key) => {
                                        return <Option value={item} key={key}>{item}</Option>
                                    })}
                                </Select>
                            </Col>

                            <Col span={5} className="gutter-row">
                                <Button disabled={!this.enableEdit[key]} onClick={() => this.onSaveChange(key, item.name)} >保存</Button>
                                <Button onClick={() => this.onEditSource(key, item.name)} >编辑</Button>
                                <Button onClick={() => this.onDeleteSource(key, item.name)}>删除</Button>
                            </Col>
                        </Row>)
                    })}

                </div>
            </div>
        );
    }

    @action.bound onItemSave(data) {
        this.dataSources.push(data);
        this.enableEdit.push(false);
    }

    @action onDeleteSource(key) {
        const source = this.dataSources.splice(key, 1)[0];
        this.enableEdit[key] = false;
        this.elastic.deleteMultipleDataSource(source.name);
        this.appStore.multipleDataNames.splice(key, 1);
    }

    @action onEditSource(key, name) {
        console.log('key', key)
        this.name = name
        let that = this
        for (var i = 0; i < this.dataSources.length; i++) {
            if (name == this.dataSources[i].name) {
                this.data = this.dataSources[i]
            }
        }
        confirm({
            title: 'edit',
            content: 'Are you sure to edit ' + name + ' ?',
            onOk() {
                that.enableEdit[key] = true;
            },
            onCancel() {
                console.log('Cancel');
            },
        })
        // this.enableEdit[key] = true;
    }
}

export default DataSourceItem;
