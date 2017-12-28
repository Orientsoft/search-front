import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col, Select, Input, Button, Modal } from 'antd';
import get from 'lodash/get';
import BaseComponent from './BaseComponent';

const Option = Select.Option;
const confirm = Modal.confirm;

@observer class DataSourceItem extends BaseComponent {

    @observable.ref types = ['db', 'weblogic', 'tuxedo', '业务', '系统']
    @observable.ref fields = []
    @observable.ref indices = []
    @observable dataSource = []
    @observable enableEdit = []

    @observable keys = []
    @observable originname = ''
    @observable category = ''
    @observable index = ''


    // 需要提交保存的数据
    data = {category:'',index:'',fields:[],name:''}
    name = ''

    constructor(props) {
        super(props)

    }

    componentWillMount() {
        this.elastic.getSingleDataSource().then(result => {
            this.dataSource = get(result, 'hits.hits', []).map(data => data._source);
            // this.appStore.singleDatas =  this.dataSource
            this.enableEdit = Array(this.dataSource.length);
        });
        this.elastic.catIndices().then(action(indices => {
            this.indices = indices.map((index) => index.index);
        }));
    }


    onTypeChange(type) {
        this.data.category = type;
        this.category = type
    }

    onIndexChange(index) {
        this.data.index = index;
        this.index = index;
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
        this.keys = value;
    }

    onNameChange(value) {
        this.data.name = value;
        this.originname = value;
    }

    onEditType(type) {
        this.data.category = type;
    }

    onEditIndex(index) {
        this.data.index = index;
        console.log('index', index)
        this.elastic.getIndices(index).then(action(result => {
            const mappings = get(result, [index, 'mappings'], {});
            const type = Object.keys(mappings)[0];

            if (type) {
                this.data.type = type;
                this.fields = Object.keys(mappings[type].properties);
            }
        }))
    }

    onEditKey(value) {
        this.elastic.getIndices(this.data.index).then(action(result => {
            const mappings = get(result, [this.data.index, 'mappings'], {});
            const type = Object.keys(mappings)[0];

            if (type) {
                this.data.type = type;
                this.fields = Object.keys(mappings[type].properties);
            }
        }))
        this.data.fields = value;
    }

    onSave() {
        // if ((this.data.category = '') || (this.data.index = '') || (this.data.name = '') || (this.data.fields = [])){
        //     alert(' all values are required !')
        // } else {
            
        // }
        this.elastic.saveSingleDataSource(this.data.name, this.data);
            this.dataSource.push(this.data);
            // this.appStore.singleDatas.push(this.data)

            this.enableEdit.push(false);
            this.fields = []
            // this.data = {}

            this.keys = []
            this.category = ''
            this.index = ''
            this.originname = ''

    }

    onSaveChange(key, name) {
        console.log("this.data", this.data)
        this.elastic.updateSingleDataSource(this.data.name, this.data);
        // for(let i=0; i< this.dataSource.length;i++){
        //     if(this.dataSource[i].name == name){
        //         // this.dataSource[i] = this.data
        //         this.appStore.singleDatas[i] = this.data
        //     }
        // }
        // this.dataSource.push(this.data);
        // this.data = {}

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

                    <Row gutter={16} style={{ display: this.props.add }}>
                        <Col span={3} className="gutter-row">
                            <Select style={{ width: '100%' }} value={this.category} onChange={(value) => this.onTypeChange(value)}>
                                {
                                    this.types && this.types.map((type, key) => {
                                        return <Option value={type} key={key}>{type}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={3} className="gutter-row">
                            <Select style={{ width: '100%' }} value={this.index} onChange={(value) => this.onIndexChange(value)}>
                                {
                                    this.indices && this.indices.map((index, key) => {
                                        return <Option value={index} key={key}>{index}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={9} className="gutter-row">
                            <Select
                                mode="tags"
                                placeholder="Please select"
                                value={this.keys.slice()}
                                style={{ width: '100%' }}
                                onChange={(value) => this.onKeyChange(value)}
                            >
                                {
                                    this.fields && this.fields.map((field, key) => {
                                        return <Option value={field} key={key}>{field}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={4} className="gutter-row">
                            <Input onChange={(e) => this.onNameChange(e.target.value)} value={this.originname} />
                        </Col>
                        <Col span={5} className="gutter-row">
                            <Button type="primary" onClick={() => this.onSave()}>保存</Button>
                        </Col>
                    </Row>
                </div>

                <div className='contentManager'>
                    {this.dataSource.map((item, key) => {
                        return (<Row gutter={16} key={key}>
                            <Col span={3} className="gutter-row">
                                <Select value={item.category} style={{ width: '100%' }} disabled={!this.enableEdit[key]} onChange={(value) => this.onEditType(value)}>
                                    {this.types && this.types.map((item, key) => {
                                        return <Option value={item} key={key}>{item}</Option>
                                    })}
                                </Select>
                            </Col>
                            <Col span={3} className="gutter-row">
                                <Select value={item.index} style={{ width: '100%' }} disabled={!this.enableEdit[key]} onChange={(value) => this.onEditIndex(value)}>
                                    {this.indices && this.indices.map((item, key) => {
                                        return <Option value={item} key={key}>{item}</Option>
                                    })}
                                </Select>
                            </Col>
                            <Col span={9} className="gutter-row">
                                <Select
                                    mode="tags"
                                    placeholder="Please select"
                                    value={item.fields.slice()}
                                    style={{ width: '100%' }}
                                    onChange={(value) => this.onEditKey(value)}
                                    disabled={!this.enableEdit[key]}
                                >
                                    {this.fields && this.fields.map((field, key) => {
                                        return <Option value={field} key={key}>{field}</Option>
                                    })}
                                </Select>
                            </Col>
                            <Col span={4} className="gutter-row">
                                <Input value={item.name} disabled />
                            </Col>
                            <Col span={5} className="gutter-row">
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
        this.appStore.singleDatas = this.dataSource
        this.enableEdit[key] = false;
        this.elastic.deleteSingleDataSource(source.name);
    }

    @action onEditSource(key, name) {
        let that = this
        this.name = name
        for (var i = 0; i < this.dataSource.length; i++) {
            if (name == this.dataSource[i].name) {
                this.data = this.dataSource[i]
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
