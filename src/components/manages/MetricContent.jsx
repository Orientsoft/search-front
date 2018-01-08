import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col, Select, Input, Button, Modal, Form } from 'antd';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import values from 'lodash/values';
import BaseComponent from '../BaseComponent';

const Option = Select.Option;
const confirm = Modal.confirm;
const FormItem = Form.Item;

@observer class MetricContent extends BaseComponent {
    // 当前指标绑定的数据源
    @observable.ref source = null;
    @observable dataSource = [];

    @observable.ref fields = [];
    @observable originName = '';
    @observable originSource = '';
    @observable chartType = '';
    @observable chartTitle = '';
    @observable yaxis = '';
    @observable xTitle = '';
    @observable YTitle = '';
    xfields = {};

    // 需要提交保存的数据
    data = { name: '', source: '', fields: [], chart: { title: '', type: '', x: { field: '', label: '' }, y: { field: '', label: '' } } }
    name = ''

    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible,
            visibleEdit: false
        }
    }
    componentWillMount() {
        this.elastic.getMetricDataSource().then(result => {
            let data = get(result, 'hits.hits', []).map(data => data._source);
            //this.appStore.config.metrics = data;
          

            for (let key in data) {
                this.dataSource[key] = JSON.parse(data[key].data);
                this.appStore.config.metrics[key] = JSON.parse(data[key].data);
                this.dataSource[key]['fieldShow'] = [];
            }
            //设置字段显示数据为 a=b, 通过为datasource添加fieldShow字段
            for (let key in this.dataSource.slice()) {
                let fields = this.dataSource[key].fields;
                var allshow = [];
                for (let j in fields.slice()) {
                    let field = fields[j].field;
                    let value = fields[j].value;
                    let show = field + ' = ' + value;
                    allshow.push(show);
                }
                this.dataSource[key].fieldShow = allshow;
            }
            console.log(' this.datasource ', this.dataSource)
        })
        this.elastic.getSingleDataSource().then(result => {
            this.setState({
                sources: this.getHits(result).map(data => data._source)
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }

    /**
     * 数据源更新回调函数
     * @param {Number} key - 数据源索引
     */
    @action.bound onSourceChanged(key) {
        this.fields = []
        this.originSource = key
        this.source = this.state.sources[key];
        this.data.source = this.source.name
        let keys = get(this.source, 'fields', [])
        this.fields = JSON.parse(keys)
        console.log('source', this.source)
    }

    onNameChange(e) {
        this.data.name = e;
        this.originName = e;
    }
    onfieldNameChange(e) {
        var field = e.target.dataset.field
        var value = e.target.value
        var obj = { field: field, value: value }
        // this.data.fields.push(obj)
        this.xfields[field] = obj;
    }
    onTypeChange(e) {
        this.data.chart.type = e;
        this.chartType = e;
        console.log('type', this.data.chart.type)
    }
    onTitleChange(e) {
        this.data.chart.title = e;
        this.chartTitle = e;
        console.log('title', this.data.chart.title)
    }
    onYaxisChange(e) {
        this.data.chart.y.field = e;
        this.yaxis = e;
        console.log('y', this.data.chart.y.field)
    }
    onTitleYChange(e) {
        this.data.chart.y.label = e;
        this.YTitle = e;
        console.log('ylabel', this.data.chart.y.label)
    }
    onTitleXChange(e) {
        this.data.chart.x.label = e.target.value;
        this.data.chart.x.field = e.target.dataset.xaxis;
        this.xTitle = e.target.value;
        console.log('xlabel', this.data.chart.x.label, this.data.chart.x.field)
    }
    onSave(e) {
        var xfields = values(this.xfields);
        this.data.fields = xfields

        this.elastic.saveMetricDataSource(this.data.name, {
            data: JSON.stringify(this.data)
        });
        this.dataSource.push(this.data)
        this.appStore.config.metrics.push(this.data)

        //设置显示的字段        
        let length = this.dataSource.length - 1
        this.dataSource[length]['fieldShow'] = []
        let fields = this.dataSource[length].fields
        var allshow = []
        for (let key in fields.slice()) {
            let field = fields[key].field
            let value = fields[key].value
            let show = field + ' = ' + value
            allshow.push(show)
        }
        this.dataSource[length].fieldShow = allshow
        this.props.setVisible(false);

        this.data = { name: '', source: '', fields: [], chart: { title: '', type: '', x: { field: '', label: '' }, y: { field: '', label: '' } } }
        this.fields = [];
        this.originName = '';
        this.originSource = '';
        this.chartType = '';
        this.chartTitle = '';
        this.yaxis = '';
        this.xTitle = '';
        this.YTitle = '';
    }
    onCancel() {
        this.props.setVisible(false);
        this.data = { name: '', source: '', fields: [], chart: { title: '', type: '', x: { field: '', label: '' }, y: { field: '', label: '' } } }
        this.fields = [];
        this.originName = '';
        this.originSource = '';
        this.chartType = '';
        this.chartTitle = '';
        this.yaxis = '';
        this.xTitle = '';
        this.YTitle = '';
    }

    //修改
    onSourceEdit(key) {
        this.fields = [];

        this.source = this.state.sources[key];
        this.data.source = this.source.name;
        //数据源改变，y轴改变
        this.data.chart.y.field = '';
        this.data.chart.y.label = '';
        //数据源改变，字段改变
        let keys = get(this.source, 'fields', []);
        this.fields = JSON.parse(keys);
        let fields = []
        for (let i = 0; i < this.fields.length; i++) {
            var obj = { field: this.fields[i].field, value: '' }
            fields.push(obj)
        }
        this.data.fields = fields
    }

    onfieldNameEdit(e) {
        var field = e.target.dataset.field;
        var value = e.target.value;
        for (let key in this.data.fields.slice()) {
            if (this.data.fields[key].field == field) {
                this.data.fields[key].value = value
            }
        }
    }
    onTypeEdit(e) {
        this.data.chart.type = e;
    }
    onTitleEdit(e) {
        this.data.chart.title = e;
    }
    onYaxisEdit(e) {
        this.data.chart.y.field = e;
    }
    onTitleYEdit(e) {
        this.data.chart.y.label = e;
    }
    onTitleXEdit(e) {
        this.data.chart.x.label = e.target.value;
        this.data.chart.x.field = e.target.dataset.xaxis;
    }

    onSaveChange() {
        let fields = [];
        for (let key in this.data.fields.slice()) {
            if (this.data.fields[key].value != '') {
                fields.push(this.data.fields[key])
            }
        }
        this.data.fields = fields;
        //更新 appstore
        for (let i = 0; i < this.appStore.config.metrics.length; i++) {
            if (this.appStore.config.metrics[i].name == this.data.name) {
                this.appStore.config.metrics[i] = this.data
            }
        }

        this.elastic.updateMetricDataSource(this.data.name, {
            data: JSON.stringify(this.data)
        });
        //展示的字段
        for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].name == this.data.name) {
                this.dataSource[i] = this.data
                let fields = this.dataSource[i].fields
                var allshow = []
                for (let key in fields.slice()) {
                    let field = fields[key].field
                    let value = fields[key].value
                    let show = field + ' = ' + value
                    allshow.push(show)
                }
                this.dataSource[i].fieldShow = allshow
            }
        }
       
        this.setState({
            visibleEdit: false
        });
    }
    onCancelChange() {
        this.setState({
            visibleEdit: false
        });
        this.data = { name: '', source: '', fields: [], chart: { title: '', type: '', x: { field: '', label: '' }, y: { field: '', label: '' } } };
    }

    @action onEditSource(key, name) {
        this.setState({
            visibleEdit: true
        })

        //this.source = this.state.sources[key];
        this.name = name
        for (var i = 0; i < this.dataSource.length; i++) {
            if (name == this.dataSource[i].name) {
                this.data = this.dataSource[i]
                this.source = this.state.sources[key]
                console.log('this.data', this.data, this.source)
            }
        }
    }

    @action onDeleteSource(key, name) {
        const source = this.dataSource.splice(key, 1)[0];
        this.appStore.config.metrics.splice(key, 1)[0];
        // this.enableEdit[key] = false;
        this.elastic.deleteMetricDataSource(name);
    }

    render() {
        const { sources = [] } = this.state;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        }
        const formItemLayoutSelect = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        }
        let antdFormAdd = <Form horizonal='true'>
            <h4>指标选项</h4>
            <FormItem {...formItemLayout} label='指标名：'>
                <Input onChange={(e) => this.onNameChange(e.target.value)} value={this.originName} />
            </FormItem>
            <FormItem {...formItemLayout} label='数据源：'>
                <Select value={this.originSource} style={{ width: '100%' }} onChange={(value) => this.onSourceChanged(value)}>
                    {this.state.sources && this.state.sources.map((source, key) => <Option key={key} value={key}>{source.name}</Option>)}
                </Select>
            </FormItem>
            {this.fields.map((item, key) => (
                <Row key={key}>
                    <Col span="11" offset="2" >
                        <FormItem {...formItemLayoutSelect} label='字段:'  >
                            <Input value={item.field} disabled />
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem {...formItemLayoutSelect} label='值：' >
                            <Input data-field={item.field} onChange={(e) => this.onfieldNameChange(e)} />
                        </FormItem>
                    </Col>
                </Row>
            ))}
            <h4>图表选项</h4>
            <FormItem {...formItemLayout} label='类型：'>
                <Select value={this.chartType} style={{ width: '100%' }} onChange={(value) => this.onTypeChange(value)}>
                    <Option value="bar" key="bar">柱状图</Option>
                    <Option value="line" key="line">折线图</Option>
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='标题：'>
                <Input value={this.chartTitle} onChange={(e) => this.onTitleChange(e.target.value)} />
            </FormItem>
            <Row >
                <Col span="11" offset="2" >
                    <FormItem {...formItemLayoutSelect} label='X轴：'  >
                        <Select style={{ width: '100%' }} value={get(this.source, 'time', '@timestamp')} disabled />
                    </FormItem>
                </Col>
                <Col span="11">
                    <FormItem {...formItemLayoutSelect} label='标题：' >
                        <Input value={this.xTitle} data-xaxis={get(this.source, 'time', '@timestamp')} onChange={(e) => this.onTitleXChange(e)} />
                    </FormItem>
                </Col>
            </Row>
            <Row >
                <Col span="11" offset="2" >
                    <FormItem {...formItemLayoutSelect} label='Y轴：'  >
                        <Select value={this.yaxis} style={{ width: '100%' }} onChange={(value) => this.onYaxisChange(value)}>
                            {get(this.source, 'field', []).map((field, key) => {
                                return <Option value={field} key={key}>{field}</Option>
                            }
                            )}
                        </Select>
                    </FormItem>
                </Col>
                <Col span="11">
                    <FormItem {...formItemLayoutSelect} label='标题：' >
                        <Input value={this.YTitle} onChange={(e) => this.onTitleYChange(e.target.value)} />
                    </FormItem>
                </Col>
            </Row>
        </Form>

        let antdFormEdit = <Form horizonal='true'>
            <h4>指标选项</h4>
            <FormItem {...formItemLayout} label='指标名:'>
                <Input value={this.data.name} disabled />
            </FormItem>
            <FormItem {...formItemLayout} label='数据源:'>
                <Select value={this.data.source} style={{ width: '100%' }} onChange={(value) => this.onSourceEdit(value)}>
                    {this.state.sources && this.state.sources.map((source, key) => <Option key={key} value={key}>{source.name}</Option>)}
                </Select>
            </FormItem>
            {this.data.fields.map((item, key) => (
                <Row key={key}>
                    <Col span="11" offset="2" >
                        <FormItem {...formItemLayoutSelect} label='字段:'  >
                            <Input value={item.field} disabled />
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem {...formItemLayoutSelect} label='值:' >
                            <Input data-field={item.field} onChange={(e) => this.onfieldNameEdit(e)} value={item.value} />
                        </FormItem>
                    </Col>
                </Row>
            ))}
            <h4>图表选项</h4>
            <FormItem {...formItemLayout} label='类型:'>
                <Select value={this.data.chart.type} style={{ width: '100%' }} onChange={(value) => this.onTypeEdit(value)}>
                    <Option value="bar" key="bar">bar</Option>
                    <Option value="line" key="line">line</Option>
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='标题:'>
                <Input value={this.data.chart.title} onChange={(e) => this.onTitleEdit(e.target.value)} />
            </FormItem>
            <Row >
                <Col span="11" offset="2" >
                    <FormItem {...formItemLayoutSelect} label='X轴:'  >
                        <Select style={{ width: '100%' }} value={get(this.source, 'time', '@timestamp')} disabled />
                    </FormItem>
                </Col>
                <Col span="11">
                    <FormItem {...formItemLayoutSelect} label='标题:' >
                        <Input value={this.data.chart.x.label} data-xaxis={get(this.source, 'time', '@timestamp')} onChange={(e) => this.onTitleXChange(e)} />
                    </FormItem>
                </Col>
            </Row>
            <Row >
                <Col span="11" offset="2" >
                    <FormItem {...formItemLayoutSelect} label='Y轴:'  >
                        <Select value={this.data.chart.y.field} style={{ width: '100%' }} onChange={(value) => this.onYaxisChange(value)}>
                            {get(this.source, 'field', []).map((field, key) => {
                                return <Option value={field} key={key}>{field}</Option>
                            }
                            )}
                        </Select>
                    </FormItem>
                </Col>
                <Col span="11">
                    <FormItem {...formItemLayoutSelect} label='标题:' >
                        <Input value={this.data.chart.y.label} onChange={(e) => this.onTitleYChange(e.target.value)} />
                    </FormItem>
                </Col>
            </Row>
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
                    onCancel={this.onCancelChange.bind(this)}
                >
                    {antdFormEdit}
                </Modal>
                <Row gutter={5}>
                    <Col span={2} className="gutter-row">指标名:</Col>
                    <Col span={2} className="gutter-row">数据源:</Col>
                    <Col span={4} className="gutter-row">字段:</Col>
                    <Col span={2} className="gutter-row">图表类型:</Col>
                    <Col span={2} className="gutter-row">标题:</Col>
                    <Col span={2} className="gutter-row">X轴字段:</Col>
                    <Col span={2} className="gutter-row">X轴标题:</Col>
                    <Col span={2} className="gutter-row">Y轴字段:</Col>
                    <Col span={2} className="gutter-row">Y轴标题:</Col>
                </Row>
                <div className='contentManager'>
                    {this.dataSource.slice().map((item, key) => {
                        return (<Row gutter={5} key={key}>
                            <Col span={2} className="gutter-row">
                                <Input value={item.name} disabled key={key} ></Input>
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.source} disabled key={key} ></Input>
                            </Col>
                            <Col span={4} className="gutter-row">
                                <Select
                                    mode="tags"
                                    placeholder="Please select"
                                    value={item.fieldShow ? item.fieldShow.slice() : []}
                                    style={{ width: '100%' }}
                                    disabled
                                >
                                </Select>
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart ? item.chart.type : ''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart ? item.chart.title : ''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart ? item.chart.x.field : ''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart ? item.chart.x.label : ''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart ? item.chart.y.field : ''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart ? item.chart.y.label : ''} disabled key={key} />
                            </Col>
                            <Col span={4} className="gutter-row">
                                <Button onClick={() => this.onEditSource(key, item.name)} >编辑</Button>
                                <Button onClick={() => this.onDeleteSource(key, item.name)}>删除</Button>
                            </Col>
                        </Row>)
                    })}
                </div>
            </div>
        );
    }


}

export default MetricContent;
