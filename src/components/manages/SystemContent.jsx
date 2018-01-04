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
    @observable dataSourcesForShow = []
    @observable enableEdit = []
    @observable editdata = {name: '', sources: [], metrics: []}

    @observable originname = ''
    @observable originSources = []
    @observable originMetrics = []

    // 需要提交保存的数据
    // data = {}
    data2 = { name: '', sources: [], metrics: [] }
    name = ''
    metric = []
    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible,
            visibleEdit: false
        }
    }

    componentWillMount() {
        this.elastic.getMultipleDataSource().then(result => {
            let dataSources = get(result, 'hits.hits', []).map(data => data._source);
            this.dataSources = dataSources
            this.appStore.multipleDataNames = get(result, 'hits.hits', []).map(data => data._source.name);
            this.enableEdit = Array(dataSources.length);
            console.log('datasources', dataSources.slice())

            //展示数据
            for (let key in dataSources.slice()) {
                let name = dataSources[key].name
                let sources = dataSources[key].sources[0].name
                // this.dataSources[key]['sources'] = sources
                let metrics = dataSources[key].metrics
                let allmetricname = []
                for (let j in metrics.slice()) {
                    let metricname = metrics[j].name
                    allmetricname.push(metricname)
                }
                let obj = { name: name, sources: sources, metrics: allmetricname }
                this.dataSourcesForShow.push(obj)
            }
            
        });

        // this.fields = this.appStore.singleDataNames
        this.elastic.getSingleDataSource().then(result => {
            this.fields = get(result, 'hits.hits', []).map(data => data._source.name);
            // this.enableEdit = Array(this.dataSources.length);
        });
        this.elastic.getmetricDataSource().then(result => {
            let metrics = get(result, 'hits.hits', []).map(data => data._source.data);
            for (let key in metrics) {
                let name = JSON.parse(metrics[key]).name
                this.metrics.push(name)
            }
            // this.enableEdit = Array(this.dataSources.length);
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }

    onNameChange(value) {
        // this.data.name = value;
        this.data2.name = value;
        this.originname = value
    }

    onKeyChange(value) {
        let arr = [{ name: value }]
        // this.data.fields = value;
        this.data2.sources = arr
        this.originSources = value
    }

    onMetricChange(value) {
        this.originMetrics = value
        this.metric = value
        console.log('metric', value)
    }

    onEditKey(value) {
        let arr = [{ name: value }]
        this.editdata.sources = value
        // this.data.fields = value;
        this.data2.sources = arr
    }

    onEditMetric(value) {
        this.editdata.metrics = value
        this.metric = value
        console.log('metric', this.metric)
    }

    onSave() {
        console.log('save',this.metric)
        this.props.setVisible(false)
        for (let key in this.metric) {
            let obj = { name: this.metric[key] }
            this.data2.metrics.push(obj)
        }
        this.elastic.saveMultipleDataSource(this.data2.name, this.data2);
        this.dataSources.push(this.data2)

        let name = this.data2.name
        let sources = this.data2.sources[0].name
        let metrics = this.data2.metrics
        let allmetricname = []
        for (let j in metrics.slice()) {
            let metricname = metrics[j].name
            allmetricname.push(metricname)
        }
        let obj = { name: name, sources: sources, metrics: allmetricname }
        this.dataSourcesForShow.push(obj)

        // this.props.onSave(this.data);
        // this.dataSources.push(this.data2);
        this.enableEdit.push(false);
        this.originSources = [];
        this.originname = '';
        this.originMetrics = [];
        this.metric = [];
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
        for (let key in this.metric) {
            let obj = { name: this.metric[key] }
            this.data2.metrics.push(obj)
        }
        this.elastic.updateMultipleDataSource(this.data2.name, this.data2);

        let name = this.data2.name
        let sources = this.data2.sources[0].name
        let metrics = this.data2.metrics
        let allmetricname = []
        for (let j in metrics.slice()) {
            let metricname = metrics[j].name
            allmetricname.push(metricname)
        }
        let obj = { name: name, sources: sources, metrics: allmetricname }
        for (var i = 0; i < this.dataSourcesForShow.length; i++) {
            if (name == this.dataSources[i].name) {
                this.dataSourcesForShow[i] = obj
            }
        }
        for (var i = 0; i < this.dataSources.length; i++) {
            if (name == this.dataSources[i].name) {
                this.dataSources[i] = this.data2
            }
        }
        this.enableEdit[key] = false;
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
            <Input onChange={(e) => this.onNameChange(e.target.value)} value={this.editdata.name} />
        </FormItem>
        <FormItem {...formItemLayout} label='数据源:'>
            <Select
                mode="tags"
                placeholder="Please select"
                value={this.editdata.sources ? this.editdata.sources.slice() : this.editdata.sources}
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
                value={this.editdata.metrics ? this.editdata.metrics.slice() :this.editdata.metrics}
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
                    {this.dataSourcesForShow.slice().map((item, key) => {
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

    @action.bound onItemSave(data) {
        this.dataSources.push(data);
        this.enableEdit.push(false);
    }

    @action onDeleteSource(key) {
        console.log('key',key)
        const source = this.dataSources.splice(key, 1)[0];
        this.dataSourcesForShow.splice(key, 1)[0];
        this.enableEdit[key] = false;
        this.elastic.deleteMultipleDataSource(source.name);
        this.appStore.multipleDataNames.splice(key, 1);
    }

    @action onEditSource(key, name) {
        this.setState({
            visibleEdit: true
        })
        this.name = name
        console.log('name', name)

        for (var i = 0; i < this.dataSourcesForShow.length; i++) {
            if (name == this.dataSourcesForShow[i].name) {
                this.editdata = this.dataSourcesForShow[i]
                console.log('this.editdata',this.editdata)
            }
        }
        for (var i = 0; i < this.dataSources.length; i++) {
            if (name == this.dataSources[i].name) {
                this.data2 = this.dataSources[i]
            }
        }
    }
}

export default SystemContent;
