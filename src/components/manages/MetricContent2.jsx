import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col, Select, Input, Button, Modal, Form } from 'antd';
import get from 'lodash/get';
import BaseComponent from '../BaseComponent';

const Option = Select.Option;
const confirm = Modal.confirm;
const FormItem = Form.Item;

@observer class MetricContent extends BaseComponent {
    // 当前指标绑定的数据源
    @observable.ref source = null;
    @observable.ref fields = [];
    @observable dataSource = [];

    // 需要提交保存的数据
    data = { name: '', source: '', fields: [], chart: { title: '', type: '', x: { field: '', label: '' }, y: { field: '', label: '' } } }

    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible,
            visibleEdit: false
        }
    }
    componentWillMount() {
        this.elastic.getmetricDataSource().then(result => {
            let data = get(result, 'hits.hits', []).map(data => data._source);
            for(let key in data){
                this.dataSource[key] = JSON.parse(data[key].data)
            }
            console.log('mutipledata',this.dataSource );
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
        this.source = this.state.sources[key];
        this.data.source = this.source.name
        let keys = get(this.source, 'fields', [])
        this.fields = JSON.parse(keys)
    }

    onNameChange(e) {
        console.log("name", e)
        this.data.name = e;
    }

    onfieldNameChange(e){
        var field = e.target.dataset.field
        var value = e.target.value
        var obj = { field:field,value:value}
        this.data.fields.push(obj)
    }

    onTypeChange(e) {
        console.log("type", e)
        this.data.chart.type = e;
    }
   
    onTitleChange(e) {
        console.log("title", e)
        this.data.chart.title = e;
    }
    onYaxisChange(e) {
        console.log("yaxis", e)
        this.data.chart.y.field = e;
    }
    onTitleYChange(e) {
        console.log("titleY", e)
        this.data.chart.y.label = e;
    }
    onTitleXChange(e) {
        console.log("titleX", e.target.dataset.xaxis, e.target.value)
        this.data.chart.x.label = e.target.value;
        this.data.chart.x.field = e.target.dataset.xaxis;
    }
    
    onSave(e) {
        console.log('this.data',JSON.stringify(this.data))
        this.elastic.saveMetricDataSource(this.data.name, {
            data: JSON.stringify(this.data)
        });
        this.props.setVisible(false);
        // onChange={this.onSourceChanged}
    }
    onCancel() {
        this.props.setVisible(false);
    }
    onSaveChange() {

    }
    onCancelChange() {
        this.setState({
            visibleEdit: false
        })
    }
    onEditSource(e){

    }
    onDeleteSource(e){

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
                <Input onChange={(e) => this.onNameChange(e.target.value)} />
            </FormItem>
            <FormItem {...formItemLayout} label='数据源：'>
                <Select style={{ width: '100%' }} onChange={(value) => this.onSourceChanged(value)}>
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
                <Select  style={{ width: '100%' }} onChange={(value) => this.onTypeChange(value)}>
                    <Option value="bar" key="bar">柱状图</Option>
                    <Option value="line" key="line">折线图</Option>
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='标题：'>
                <Input onChange={(e) => this.onTitleChange(e.target.value)} />
            </FormItem>
            <Row >
                <Col span="11" offset="2" >
                    <FormItem {...formItemLayoutSelect} label='X轴：'  >
                        <Select style={{ width: '100%' }} value={get(this.source, 'time', '@timestamp')} disabled />
                    </FormItem>
                </Col>
                <Col span="11">
                    <FormItem {...formItemLayoutSelect} label='标题：' >
                        <Input  data-xaxis={get(this.source, 'time', '@timestamp')} onChange={(e) => this.onTitleXChange(e)} />
                    </FormItem>
                </Col>
            </Row>
            <Row >
                <Col span="11" offset="2" >
                    <FormItem {...formItemLayoutSelect} label='Y轴：'  >
                        <Select style={{ width: '100%' }} onChange={(value) => this.onYaxisChange(value)}>
                            {get(this.source, 'field', []).map((field, key) => {
                                return <Option value={field} key={key}>{field}</Option>
                            }
                            )}
                        </Select>
                    </FormItem>
                </Col>
                <Col span="11">
                    <FormItem {...formItemLayoutSelect} label='标题：' >
                        <Input onChange={(e) => this.onTitleYChange(e.target.value)} />
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
                    {antdFormAdd}
                </Modal>
                <Row gutter={5}>
                    <Col span={2} className="gutter-row">指标名:</Col>
                    <Col span={2} className="gutter-row">数据源:</Col>
                    <Col span={4} className="gutter-row">字段</Col>
                    <Col span={2} className="gutter-row">图表类型</Col>
                    <Col span={2} className="gutter-row">标题</Col>
                    <Col span={2} className="gutter-row">X轴</Col>
                    <Col span={2} className="gutter-row">X轴标题</Col>
                    <Col span={2} className="gutter-row">Y轴</Col>
                    <Col span={2} className="gutter-row">X轴标题</Col>
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
                                    // value={item.fields ? item.fields.slice() : item.fields}
                                    style={{ width: '100%' }}
                                    onChange={(value) => this.onEditKey(value)}
                                    // disabled={!this.enableEdit[key]}
                                >
                                </Select>
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart?item.chart.type:''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart?item.chart.title:''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart?item.chart.x.field:''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart?item.chart.x.label:''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart?item.chart.y.field:''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart?item.chart.y.label:''} disabled key={key} />
                            </Col>
                            <Col span={4} className="gutter-row">
                                <Button onClick={() => this.onEditSource(key, item.name)} >编辑</Button>
                                <Button onClick={() => this.onDeleteSource(key)}>删除</Button>
                            </Col>
                        </Row>)
                    })}
                </div>
            </div>
        );
    }
}

export default MetricContent;
