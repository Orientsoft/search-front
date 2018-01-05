import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col, Select, Input, Button, Modal, Form } from 'antd';
import get from 'lodash/get';
import has from 'lodash/has';
import values from 'lodash/values'
import BaseComponent from '../BaseComponent';
import getFields from '../../utils/fields';

const Option = Select.Option;
const confirm = Modal.confirm;
const FormItem = Form.Item;

@observer class DataSourceItem2 extends BaseComponent {
    //select option
    @observable.ref types = ['db', 'weblogic', 'tuxedo', '业务', '系统']
    @observable.ref fields = []
    @observable.ref indices = []
    @observable.ref time = []
    @observable dataSource = []
    @observable dataSourceshow = []
    @observable enableEdit = []
    //select 显示的value
    @observable keys = []
    @observable originname = ''
    @observable category = ''
    @observable index = ''
    @observable ts = ''
    xfields = {}


    // 需要提交保存的数据
    data = { category: '', index: '', fields: [], name: '', time: [], field: [] }
    name = ''

    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible,
            visibleEdit: false
        }
    }

    componentWillMount() {
        this.elastic.getSingleDataSource().then(result => {
            this.dataSource = get(result, 'hits.hits', []).map(data => data._source);
            for (var i = 0; i < this.dataSource.length; i++) {
                let fields = JSON.parse(this.dataSource[i].fields)
                let allkeys = []
                for (var j = 0; j < fields.length; j++) {
                    let key = fields[j].label
                    allkeys.push(key)
                }
                this.dataSource[i].keys = allkeys
            }
            console.log('all', this.dataSource.slice())
            this.enableEdit = Array(this.dataSource.length);
        });
        this.elastic.catIndices().then(action(indices => {
            this.indices = indices.map((index) => index.index);
        }));
    }

    getAllKeys(index) {
        this.elastic.getIndices(index).then(action(result => {
            const mappings = get(result, [index, 'mappings'], {});
            const type = Object.keys(mappings)[0];

            this.fields = getFields(mappings[type]);
            for (let key in this.fields) {
                if (this.fields[key] == "@timestamp") {
                    this.time.push(this.fields[key])
                }
            }
        }));
    }

    onTypeChange(type) {
        this.data.category = type;
        this.category = type
    }

    onIndexChange(index) {
        this.data.index = index;
        this.fields = []
        this.time = []
        this.ts = []
        this.keys = []
        this.index = index;

        this.getAllKeys(index)
    }

    onTimeChange(value) {
        this.data.time = value;
        this.ts = value;
    }

    onKeyChange(value) {
        this.data.field = value;
        this.keys = value;
    }

    onNameChange(value) {
        this.data.name = value;
        this.originname = value;
    }

    onfieldNameChange(e) {  
        let value = e.target.value
        let field = e.target.dataset.field 
        let obj = {
            field: field,
            label: value
        }
        this.xfields[field] = obj;
    }

    onEditType(type) {
        this.data.category = type;
        console.log(this.data.category)
    }

    onEditIndex(index) {
        this.data.index = index;
        this.data.time = []
        this.data.fields = []
        this.data.field = []
        this.data.keys = []
        this.getAllKeys(index)
    }

    onEditTime(value) {
        this.getAllKeys(this.data.index)
        this.data.time = value;
    }

    onEditKey(value) {
        console.log('editkey',value)
        this.getAllKeys(this.data.index)
        this.data.field = value;

        // let all = []
        // for(let key in this.data.fields){
        //     for(let j in this.data.field){
        //         if(this.data.field[j] == this.data.fields[key].field ){
        //             all.push(this.data.fields[key])
        //         }else if(!has(this.data.fields[key],this.data.field[j])){
        //             all.push( { field: value[j], label: '' })
        //             console.log('all',all)
        //         }
        //     }
        // }
        // this.data.fields = all

        //删除字段时对应的中文字段没有删除
        for (var i = 0; i < value.length; i++) {           
                i = value.length - 1
                let obj = { field: value[i], label: '' }
                this.data.fields.push(obj)
        }
    }
    onEditFieldName(e) {
        let value = e.target.value
        let field = e.target.dataset.field
        // let obj = {
        //     field: field,
        //     label: value
        // }
        for (let key in this.data.fields.slice()) {
            if (this.data.fields[key].field == field) {
                this.data.fields[key].label = value
            }
        }
        // this.xfields[field] = obj;
    }

    onSave() {
        var fields = values(this.xfields);
        this.data.fields = JSON.stringify(fields)
        this.elastic.saveSingleDataSource(this.data.name, this.data);
        this.dataSource.push(this.data);
        for (var i = 0; i < this.dataSource.length; i++) {
            let fields = JSON.parse(this.dataSource[i].fields)
            let keys = []
            for (var j = 0; j < fields.length; j++) {
                let key = fields[j].label
                keys.push(key)
            }
            this.dataSource[i].keys = keys
        }


        this.enableEdit.push(false);
        this.fields = []
        this.time = []
        this.data = {}
        this.xfields = {}

        this.keys = []
        this.category = ''
        this.index = ''
        this.ts = ''
        this.originname = ''
        this.props.setVisible(false)

    }

    onCancel() {
        this.fields = []
        this.time = []
        this.data = {}
        this.xfields = {}

        this.keys = []
        this.category = ''
        this.index = ''
        this.ts = ''
        this.originname = ''
        this.props.setVisible(false)
    }

    onCancelEdit() {
        this.setState({
            visibleEdit: false
        })
        this.data = {}
    }

    onSaveChange(key, name) {
        this.data.fields = JSON.stringify(this.data.fields)

        this.elastic.updateSingleDataSource(this.data.name, this.data);
        for (var i = 0; i < this.dataSource.length; i++) {

            if (this.dataSource[i].name == this.data.name) {
                this.dataSource[i] = this.data

                let fields = JSON.parse(this.dataSource[i].fields)
                let allkeys = []
                for (var j = 0; j < fields.length; j++) {
                    let key = fields[j].label
                    allkeys.push(key)
                }
                this.dataSource[i].keys = allkeys

                console.log("savechange", this.dataSource.slice())
            }
        }
        this.setState({
            visibleEdit: false
        })

        this.enableEdit[key] = false;
        this.fields = []
        this.time = []
        this.data = {}
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        }
        const formItemLayoutSelect = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        }
        //添加数据源
        let antdFormAdd = <Form horizonal='true' >
            <FormItem {...formItemLayout} label='名称:'>
                <Input onChange={(e) => this.onNameChange(e.target.value)} value={this.originname} />
            </FormItem>
            <FormItem {...formItemLayout} label='类型:'>
                <Select style={{ width: '100%' }} value={this.category} onChange={(value) => this.onTypeChange(value)}>
                    {
                        this.types && this.types.map((type, key) => {
                            return <Option value={type} key={key}>{type}</Option>
                        })
                    }
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='数据源:'>
                <Select style={{ width: '100%' }} value={this.index} onChange={(value) => this.onIndexChange(value)}>
                    {
                        this.indices && this.indices.map((index, key) => {
                            return <Option value={index} key={key}>{index}</Option>
                        })
                    }
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='时间:'>
                <Select style={{ width: '100%' }} value={this.ts} onChange={(value) => this.onTimeChange(value)}>
                    {
                        this.time && this.time.map((index, key) => {
                            return <Option value={index} key={key}>{index}</Option>
                        })
                    }
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='字段选择'>
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
            </FormItem>
            {this.data.field && this.data.field.map((field, key) => (
                <Row key={key}>
                    <Col span="11" offset="2" >
                        <FormItem {...formItemLayoutSelect} label='字段'  >
                            <Input value={field} disabled />
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem {...formItemLayoutSelect} label='名称' >
                            <Input data-field={field} onChange={(e) => this.onfieldNameChange(e)} />
                        </FormItem>
                    </Col>
                </Row>
            ))}
        </Form>
        //修改数据源
        let editForm = <Form horizonal='true' >
            <FormItem {...formItemLayout} label='名称:'>
                <p>{this.data.name}</p>
            </FormItem>
            <FormItem {...formItemLayout} label='类型:'>
                <Select style={{ width: '100%' }} value={this.data.category} onChange={(value) => this.onEditType(value)}>
                    {
                        this.types && this.types.map((type, key) => {
                            return <Option value={type} key={key}>{type}</Option>
                        })
                    }
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='数据源:'>
                <Select style={{ width: '100%' }} value={this.data.index} onChange={(value) => this.onEditIndex(value)}>
                    {
                        this.indices && this.indices.map((index, key) => {
                            return <Option value={index} key={key}>{index}</Option>
                        })
                    }
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='时间:'>
                <Select style={{ width: '100%' }} value={this.data.time} onChange={(value) => this.onEditTime(value)}>
                    {
                        this.time && this.time.map((index, key) => {
                            return <Option value={index} key={key}>{index}</Option>
                        })
                    }
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='字段选择'>
                <Select
                    mode="tags"
                    placeholder="Please select"
                    value={this.data.field ? this.data.field.slice() : this.data.field}
                    style={{ width: '100%' }}
                    onChange={(value) => this.onEditKey(value)}
                >
                    {
                        this.fields && this.fields.map((field, key) => {
                            return <Option value={field} key={key}>{field}</Option>
                        })
                    }
                </Select>
            </FormItem>
            {(this.data.fields ? this.data.fields.slice() : this.data.fields) && this.data.fields.slice().map((item, key) => (
                <Row key={key}>
                    <Col span="11" offset="2" >
                        <FormItem {...formItemLayoutSelect} label='字段'  >
                            <Input value={item.field} disabled />
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem {...formItemLayoutSelect} label='名称' >
                            <Input data-field={item.field} value={item.label} onChange={(e) => this.onEditFieldName(e)} />
                        </FormItem>
                    </Col>
                </Row>
            ))}
        </Form>

        return (
            <div>
                <Modal
                    title="add"
                    visible={this.state.visible}
                    onOk={this.onSave.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                >
                    {antdFormAdd}
                </Modal>
                <Modal
                    title="edit"
                    visible={this.state.visibleEdit}
                    onOk={this.onSaveChange.bind(this)}
                    onCancel={this.onCancelEdit.bind(this)}
                >
                    {editForm}
                </Modal>
                <Row gutter={5}>
                    <Col span={2} className="gutter-row">类型:</Col>
                    <Col span={5} className="gutter-row">数据源:</Col>
                    <Col span={3} className="gutter-row">时间:</Col>
                    <Col span={8} className="gutter-row">字段:</Col>
                    <Col span={2} className="gutter-row">名称:</Col>
                </Row>

                <div className='contentManager'>
                    {this.dataSource.slice().map((item, key) => {
                        return (<Row gutter={5} key={key}>
                            <Col span={2} className="gutter-row">
                                <Input value={item.category} disabled key={key} ></Input>
                            </Col>
                            <Col span={5} className="gutter-row">
                                <Input value={item.index} disabled key={key} ></Input>
                            </Col>
                            <Col span={3} className="gutter-row">
                                <Input value={item.time} disabled key={key} ></Input>
                            </Col>
                            <Col span={8} className="gutter-row">
                                <Select
                                    mode="tags"
                                    placeholder="Please select"
                                    value={item.keys ? item.keys.slice() : item.keys}
                                    style={{ width: '100%' }}
                                    onChange={(value) => this.onEditKey(value)}
                                    disabled={!this.enableEdit[key]}
                                >
                                </Select>
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.name} disabled key={key} />
                            </Col>
                            <Col span={4} className="gutter-row">
                                {/* <Button disabled={!this.enableEdit[key]} onClick={() => this.onSaveChange(key, item.name)}>保存</Button> */}
                                <Button onClick={() => this.onEditSource(key, item.name)} >编辑</Button>
                                <Button onClick={() => this.onDeleteSource(key)}>删除</Button>
                            </Col>
                        </Row>)
                    })}
                </div>
            </div>
        );
    }

    @action onDeleteSource(key) {
        const source = this.dataSource.splice(key, 1)[0];
        this.appStore.singleDatas = this.dataSource
        this.enableEdit[key] = false;
        this.elastic.deleteSingleDataSource(source.name);
    }

    @action onEditSource(key, name) {
        this.setState({
            visibleEdit: true
        })
        let that = this
        this.name = name
        for (var i = 0; i < this.dataSource.length; i++) {
            if (name == this.dataSource[i].name) {
                this.data = this.dataSource[i]
                this.data.fields = JSON.parse(this.data.fields)
            }
        }
    }
}

export default DataSourceItem2;



