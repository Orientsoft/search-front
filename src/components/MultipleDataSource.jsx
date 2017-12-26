import React from 'react';
import { observable, computed, action } from 'mobx';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import Component from './Component';
import { Row, Col, Input, Button, Icon, Select, Card } from 'antd';
import MultipleItem from './MultipleItem';

const Option = Select.Option;


class MultipleDataSource extends Component {
    @observable hide = 'none'
    
    onAddData() {
        this.hide = 'block'
    }
    
    // @observable dataSources = []
    // @observable enableEdit = []

    // componentWillMount() {
    //     this.elastic.getMultipleDataSource().then(result => {
    //         this.dataSources = get(result, 'hits.hits', []).map(data => data._source);
    //         this.enableEdit = Array(this.dataSources.length);
    //     });
    // }
    
    // @action.bound onItemSave(data) {
    //     this.dataSources.push(data);
    //     this.enableEdit.push(false);
    // }

    // @action onDeleteSource(key) {
    //     const source = this.dataSources.splice(key, 1)[0];
    //     this.enableEdit[key] = false;
    //     this.elastic.deleteMultipleDataSource(source.name);
    // }

    // @action onEditSource(key) {
    //     this.enableEdit[key] = true;
    // }

    

    render() {
        return (
            <Card className='dataSource'>
                <p className='headerManager'>定义多数据源：</p>
                <Button type="primary" icon="plus" onClick={() => this.onAddData()}>添加数据</Button>
                {/* <div className='contentManager'>
                    <Row gutter={16}>
                        <Col span={5} className="gutter-row">名称:</Col>
                        <Col span={12} className="gutter-row">数据源:</Col>
                    </Row>
                    <MultipleItem onSave={this.onItemSave} />
                </div> */}
                <MultipleItem  add = {this.hide}/>
                {/* <div className='contentManager'>
                    { this.dataSources.map((item, key) => {
                        return (<Row gutter={16}>
                            <Col span={5} className="gutter-row">
                                <Input  defaultValue={item.name} disabled={!this.enableEdit[key]}/>
                            </Col>

                            <Col span={12} className="gutter-row">
                                <Select
                                    mode="tags"
                                    placeholder="Please select"
                                    defaultValue={item.fields}
                                    style={{ width: '100%' }}
                                    disabled={!this.enableEdit[key]}
                                >
                                    { this.dataSources.map((item) => {
                                        return <Option value={item.fields} key={item.fields}>{item.fields}</Option>
                                    })}
                                </Select>
                            </Col>

                            <Col span={4} className="gutter-row">
                                <Button onClick={() => this.onEditSource(key)} >编辑</Button>
                                <Button onClick={() => this.onDeleteSource(key)}>删除</Button>
                            </Col>
                        </Row>)
                    })}

                </div> */}
            </Card>
        )
    }
}

export default MultipleDataSource
