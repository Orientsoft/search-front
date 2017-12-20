import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col, Select, Input, Button } from 'antd';
import get from 'lodash/get';
import Component from './Component';

const Option = Select.Option;

@observer class DataSourceItem extends Component {

    @observable.ref fields = []
    @observable dataSources = []
    @observable enableEdit = []


    // 需要提交保存的数据
    data = {}
    name = ''

    componentWillMount() {
        console.log("appstore",this.appStore.singleDataNames)
        this.elastic.getMultipleDataSource().then(result => {
            this.dataSources = get(result, 'hits.hits', []).map(data => data._source);
            this.enableEdit = Array(this.dataSources.length);
            console.log('this.datasources',this.dataSources)
        });
        
        // this.fields = this.appStore.singleDataNames
        this.elastic.getSingleDataSource().then(result => {
            this.fields = get(result, 'hits.hits', []).map(data => data._source.name);
            this.enableEdit = Array(this.dataSources.length);
        });
    }


    onKeyChange(value) {
        console.log("multi",value)
        this.data.fields = value;
    }

    onNameChange(value) {
        this.data.name = value;
    }

    onSave() {
        console.log("this.multiple data",this.data)
        this.elastic.saveMultipleDataSource(this.data.name, this.data);
        // this.props.onSave(this.data);
        this.dataSources.push(this.data);
        this.enableEdit.push(false);
    }

    onSaveChange(key,name) {
        console.log("this.data", this.data)
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

                    <Row gutter={16}>
                        <Col span={5} className="gutter-row">
                            <Input defaultValue=" " onChange={(e) => this.onNameChange(e.target.value)} />
                        </Col>

                        <Col span={12} className="gutter-row">
                            <Select
                                mode="tags"
                                placeholder="Please select"
                                defaultValue={[]}
                                style={{ width: '100%' }}
                                onChange={(value) => this.onKeyChange(value)}
                            >
                                {this.fields.map((item, key) => {
                                    return <Option value={item} key={item}>{item}</Option>
                                })}
                            </Select>
                        </Col>

                        <Col span={4} className="gutter-row">
                            <Button type="primary" onClick={(e) => this.onSave(e)}>保存</Button>
                        </Col>
                    </Row>
                </div>
                <div className='contentManager'>
                    {this.dataSources.map((item, key) => {
                        return (<Row gutter={16}>
                            <Col span={5} className="gutter-row">
                                <Input defaultValue={item.name} disabled />
                            </Col>

                            <Col span={12} className="gutter-row">
                                <Select
                                    mode="tags"
                                    placeholder="Please select"
                                    defaultValue={item.fields}
                                    style={{ width: '100%' }}
                                    disabled={!this.enableEdit[key]}
                                >
                                    {this.fields.map((item, key) => {
                                    return <Option value={item} key={item}>{item}</Option>
                                })}
                                </Select>
                            </Col>

                            <Col span={4} className="gutter-row">
                                <Button disabled={!this.enableEdit[key]} onClick={() => this.onSaveChange(key,item.name)} >保存</Button>
                                <Button onClick={() => this.onEditSource(key,item.name)} >编辑</Button>
                                <Button onClick={() => this.onDeleteSource(key,item.name)}>删除</Button>
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
    }

    @action onEditSource(key,name) {
        this.name = name
        for (var i = 0; i < this.dataSources.length; i++) {
            if (name == this.dataSources[i].name) {
                this.data = this.dataSources[i]
            }
        }
        this.enableEdit[key] = true;
    }
}

export default DataSourceItem;
