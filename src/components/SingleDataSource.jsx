import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { Row, Col, Input, Button, Icon, Select, Card } from 'antd';
import Component from './Component';
import DataSourceItem from './DataSourceItem';

const Option = Select.Option;

@observer class SingleDataSource extends Component {
    @observable hide = 'none'
    
    onAddData() {
        this.hide = 'block'
    }

    // @observable dataSource = []
    // @observable enableEdit = []

    // componentWillMount() {
    //     this.elastic.getSingleDataSource().then(result => {
    //         this.dataSource = get(result, 'hits.hits', []).map(data => data._source);
    //         this.enableEdit = Array(this.dataSource.length);
    //     });
    // }

    render() {
        return (
            <Card className='dataSource'>
                <p className='headerManager'>定义单数据源：</p>
                <Button type="primary" icon="plus" onClick={() => this.onAddData()}>添加数据</Button>
                {/* <div className='contentManager'>
                    <Row gutter={16}>
                        <Col span={3} className="gutter-row">类型:</Col>
                        <Col span={3} className="gutter-row">数据源:</Col>
                        <Col span={9} className="gutter-row">字段选择:</Col>
                        <Col span={5} className="gutter-row">名称:</Col>
                    </Row>
                    <DataSourceItem onSave={this.onItemSave} />
                </div> */}
                {/* <DataSourceItem onSave={this.onItemSave} /> */}
                <DataSourceItem add={this.hide} />
                {/* <div className='contentManager'>
                    {this.dataSource.map((item, key) => {
                        return (<Row gutter={16} key={key}>
                            <Col span={3} className="gutter-row">
                                <Select defaultValue={item.category} style={{ width: '100%' }} disabled={!this.enableEdit[key]}>
                                    {this.dataSource.map((item) => {
                                        return <Option value={item.category} key={item.category}>{item.category}</Option>
                                    })}
                                </Select>
                            </Col>
                            <Col span={3} className="gutter-row">
                                <Select defaultValue={item.index} style={{ width: '100%' }} disabled={!this.enableEdit[key]}>
                                    {this.dataSource.map((item) => {
                                        return <Option value={item.index} key={item.index}>{item.index}</Option>
                                    })}
                                </Select>
                            </Col>
                            <Col span={9} className="gutter-row">
                                <Select
                                    mode="tags"
                                    placeholder="Please select"
                                    defaultValue={item.fields}
                                    style={{ width: '100%' }}
                                    disabled={!this.enableEdit[key]}
                                >
                                    {item.fields.map((field) => {
                                        return <Option value={field} key={field}>{field}</Option>
                                    })}
                                </Select>
                            </Col>
                            <Col span={5} className="gutter-row">
                                <Input defaultValue={item.name} disabled={!this.enableEdit[key]} />
                            </Col>
                            <Col span={4} className="gutter-row">
                                <Button onClick={() => this.onEditSource(key)} >编辑</Button>
                                <Button onClick={() => this.onDeleteSource(key)}>删除</Button>
                            </Col>
                        </Row>)
                    })}
                </div> */}
            </Card>
        );
    }

    // @action.bound onItemSave(data) {
    //     this.dataSource.push(data);
    //     this.enableEdit.push(false);
    // }

    // @action onDeleteSource(key) {
    //     const source = this.dataSource.splice(key, 1)[0];
    //     this.enableEdit[key] = false;
    //     this.elastic.deleteSingleDataSource(source.name);
    // }

    // @action onEditSource(key) {
    //     this.enableEdit[key] = true;
    // }
}

export default SingleDataSource;
