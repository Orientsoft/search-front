import React from 'react';
import { observable, computed, action } from 'mobx';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col, Select, Input, Button, Modal, Form } from 'antd';
import get from 'lodash/get';
import BaseComponent from '../BaseComponent';

const Option = Select.Option;
const confirm = Modal.confirm;
const FormItem = Form.Item;

@observer class SystemContent extends BaseComponent {

    @observable.ref fields = []
    @observable.ref metrics = []
    @observable dataSources = []
    @observable enableEdit = []

    @observable originname = ''
    @observable originSources = []
    @observable originMetrics = []

    // 需要提交保存的数据
    data2 = { name: '', sources: [], metrics: [] }
    name = ''
    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible,
            visibleEdit: false
        }
    }

    componentWillMount() {
        this.elastic.getMultipleDataSource().then(result => {
            let data = get(result, 'hits.hits', []).map(data => data._source);
            let all = []
            for (let key in data) {
                all.push(JSON.parse(data[key].data))
            }
            this.dataSources = all
            this.appStore.multipleDataNames = get(result, 'hits.hits', []).map(data => data._source.name);
            this.enableEdit = Array(this.dataSources.length);
        });

        this.elastic.getSingleDataSource().then(result => {
            this.fields = get(result, 'hits.hits', []).map(data => data._source.name);
            // this.enableEdit = Array(this.dataSources.length);
        });
        this.elastic.getMetricDataSource().then(result => {
            let metrics = get(result, 'hits.hits', []).map(data => data._source.data);
            for (let key in metrics) {
                let name = JSON.parse(metrics[key]).name
                this.metrics.push(name)
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }

    onNameChange(value) {
        this.data2.name = value;
        this.originname = value
    }

    onKeyChange(value) {
        this.data2.sources = value
        this.originSources = value
    }

    onMetricChange(value) {
        this.originMetrics = value
        this.data2.metrics = value
    }

    onEditKey(value) {
        this.data2.sources = value
    }

    onEditMetric(value) {
        this.data2.metrics = value
    }

    onSave() {
        this.props.setVisible(false)
        this.elastic.saveMultipleDataSource(this.data2.name, {
            data:JSON.stringify(this.data2)
        });
        this.dataSources.push(this.data2)

        this.enableEdit.push(false);
        this.originSources = [];
        this.originname = '';
        this.originMetrics = [];
        this.data2 = { name: '', sources: [], metrics: [] };
        this.appStore.multipleDataNames.push(this.data2.name);
    }
    onCancel(){
        this.props.setVisible(false)
    }

    onSaveChange(key) {
        this.setState({
            visibleEdit: false
        })
        this.elastic.updateMultipleDataSource(this.data2.name, {
            data:JSON.stringify(this.data2)
        });

        for (var i = 0; i < this.dataSources.length; i++) {
            if (name == this.dataSources[i].name) {
                this.dataSources[i] = this.data2
            }
        }
        this.enableEdit[key] = false;
        this.data2 = {}
    }

    onCancelEdit() {
        this.setState({
            visibleEdit: false
        })
        this.data2 = {}
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        }
        let antdFormAdd = <Form horizonal='true' >
            <FormItem {...formItemLayout} label='名称:'>
                <Input onChange={(e) => this.onNameChange(e.target.value)} value={this.originname} />
            </FormItem>
            <FormItem {...formItemLayout} label='数据源:'>
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
            </FormItem>
            <FormItem {...formItemLayout} label='指标:'>
                <Select
                    mode="tags"
                    placeholder="Please select"
                    value={this.originMetrics.slice()}
                    style={{ width: '100%' }}
                    onChange={(value) => this.onMetricChange(value)}
                >
                    {this.metrics && this.metrics.map((item, key) => {
                        return <Option value={item} key={key}>{item}</Option>
                    })}
                </Select>
            </FormItem>
        </Form>

        let editForm = <Form horizonal='true' >
        <FormItem {...formItemLayout} label='名称:'>
            <Input onChange={(e) => this.onNameChange(e.target.value)} value={this.data2.name} disabled/>
        </FormItem>
        <FormItem {...formItemLayout} label='数据源:'>
            <Select
                mode="tags"
                placeholder="Please select"
                value={this.data2.sources ? this.data2.sources.slice() : this.data2.sources}
                style={{ width: '100%' }}
                onChange={(value) => this.onEditKey(value)}
            >
                {this.fields && this.fields.map((item, key) => {
                    return <Option value={item} key={key}>{item}</Option>
                })}
            </Select>
        </FormItem>
        <FormItem {...formItemLayout} label='指标:'>
            <Select
                mode="tags"
                placeholder="Please select"
                value={this.data2.metrics ? this.data2.metrics.slice() :this.data2.metrics}
                style={{ width: '100%' }}
                onChange={(value) => this.onEditMetric(value)}
            >
                {this.metrics && this.metrics.map((item, key) => {
                    return <Option value={item} key={key}>{item}</Option>
                })}
            </Select>
        </FormItem>
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
                <div className='contentManager'>
                    <Row gutter={16}>
                        <Col span={4} className="gutter-row">名称:</Col>
                        <Col span={7} className="gutter-row">数据源:</Col>
                        <Col span={7} className="gutter-row">指标:</Col>
                    </Row>
                </div>

                <div className='contentManager'>
                    {this.dataSources.slice().map((item, key) => {
                        return (<Row key={key} gutter={16}>
                            <Col span={4} className="gutter-row">
                                <Input value={item.name} disabled />
                            </Col>

                            <Col span={7} className="gutter-row">
                                <Select
                                    mode="tags"
                                    value={item.sources.slice()}
                                    style={{ width: '100%' }}
                                    disabled={!this.enableEdit[key]}
                                    onChange={(value) => this.onEditKey(value)}
                                >
                                    {this.fields && this.fields.map((item, key) => {
                                        return <Option value={item} key={key}>{item}</Option>
                                    })}
                                </Select>
                            </Col>
                            <Col span={7} className="gutter-row">
                                <Select
                                    mode="tags"
                                    value={item.metrics.slice()}
                                    style={{ width: '100%' }}
                                    disabled={!this.enableEdit[key]}
                                    onChange={(value) => this.onEditMetric(value)}
                                >
                                    {this.metrics && this.metrics.map((item, key) => {
                                        return <Option value={item} key={key}>{item}</Option>
                                    })}
                                </Select>
                            </Col>

                            <Col span={6} className="gutter-row">
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

    @action onDeleteSource(key) {
        const source = this.dataSources.splice(key, 1)[0];
        this.enableEdit[key] = false;
        this.elastic.deleteMultipleDataSource(source.name);
        this.appStore.multipleDataNames.splice(key, 1);
    }

    @action onEditSource(key, name) {
        this.setState({
            visibleEdit: true
        })
        this.name = name
        for (var i = 0; i < this.dataSources.length; i++) {
            if (name == this.dataSources[i].name) {
                this.data2 = this.dataSources[i]
            }
        }
    }
}

export default SystemContent;
