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


    // 需要提交保存的数据
    data = { name: '', fields: {}, type: '', title: '', Yaxis: '', Xaxis: '', Ytitle: '', Xtitle: '' }

    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible,
            visibleEdit: false
        }
    }
    componentWillMount() {
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
        this.source = this.state.sources[key];
    }

    onNameChange(e) {
        console.log("name", e)
        this.data.name = e;
    }
    onTypeChange(e) {
        console.log("type", e)
        this.data.type = e;
    }
    onTitleChange(e) {
        console.log("title", e)
        this.data.title = e;
    }
    onYaxisChange(e) {
        console.log("yaxis", e)
        this.data.Yaxis = e;
    }
    onTitleXChange(e) {
        console.log("titleX", e.target.dataset.xaxis, e.target.value)
        this.data.Xtitle = e.target.value;
        this.data.Xaxis = e.target.dataset.xaxis;
    }
    onTitleYChange(e) {
        console.log("titleY", e)
        this.data.Ytitle = e;
    }
    onSave(e) {
        this.props.setVisible(false)
        // onChange={this.onSourceChanged}
    }
    onCancel() {
        this.props.setVisible(false)
    }
    onSaveChange() {

    }
    onCancelChange() {
        this.setState({
            visibleEdit: false
        })
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
        let antdFormAdd = <Form horizonal >
            <h4>指标选项</h4>
            <FormItem {...formItemLayout} label='指标名：'>
                <Input onChange={(e) => this.onNameChange(e.target.value)} />
            </FormItem>
            <FormItem {...formItemLayout} label='数据源：'>
                <Select style={{ width: '100%' }} onChange={(value) => this.onSourceChanged(value)}>
                    {this.state.sources && this.state.sources.map((source, key) => <Option key={key} value={key}>{source.name}</Option>)}
                </Select>
            </FormItem>
            {get(this.source, 'fields', []).map((field, key) => (
                <Row key={key}>
                    <Col span="11" offset="2" >
                        <FormItem {...formItemLayoutSelect} label='字段:'  >
                            <Input value={field} disabled />
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem {...formItemLayoutSelect} label='值：' >
                            <Input data-field={field} onChange={(e) => this.onfieldNameChange(e)} />
                        </FormItem>
                    </Col>
                </Row>
            ))}
            <h4>图表选项</h4>
            <FormItem {...formItemLayout} label='类型：'>
                <Select defaultValue="bar" style={{ width: '100%' }} onChange={(value) => this.onTypeChange(value)}>
                    <Option value="bar">柱状图</Option>
                    <Option value="line">折线图</Option>
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
                        <Input defaultValue="时间" data-xaxis={get(this.source, 'time', '@timestamp')} onChange={(e) => this.onTitleXChange(e)} />
                    </FormItem>
                </Col>
            </Row>
            <Row >
                <Col span="11" offset="2" >
                    <FormItem {...formItemLayoutSelect} label='Y轴：'  >
                        <Select style={{ width: '100%' }} onChange={(value) => this.onYaxisChange(value)}>
                            {get(this.source, 'fields', []).map((field, key) => {
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
                {/* <h3>指标选项</h3>
                <Row type="flex" align="middle">
                    <Col span={2}>指标名：</Col>
                    <Col span={22}><Input onChange={(e) => this.onNameChange(e.target.value)} /></Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={2}>数据源：</Col>
                    <Col span={22} >
                        <Select style={{ width: '100%' }} onChange={(value) => this.onSourceChanged(value)}>
                            {sources.map((source, key) => <Option key={key} value={key}>{source.name}</Option>)}
                        </Select>
                    </Col>
                </Row>
                {get(this.source, 'fields', []).map((field, key) => (
                    <Row key={key}>
                        <Col span={2}>字段：</Col>
                        <Col span={6}>
                            <Select value={field} disabled style={{ width: '100%' }} />
                        </Col>
                        <Col span={2}>名字：</Col>
                        <Col span={6}><Input /></Col>
                        <Col span={2}>值：</Col>
                        <Col span={6}><Input /></Col>
                    </Row>
                ))}
                <h3>图表选项</h3>
                <Row type="flex" align="middle">
                    <Col span={2}>类型：</Col>
                    <Col span={22}>
                        <Select defaultValue="bar" style={{ width: '100%' }} onChange={(value) => this.onTypeChange(value)}>
                            <Option value="bar">柱状图</Option>
                            <Option value="line">折线图</Option>
                        </Select>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={2}>标题：</Col>
                    <Col span={22}><Input onChange={(e) => this.onTitleChange(e.target.value)} /></Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={2}>X轴：</Col>
                    <Col span={10}><Select style={{ width: '100%' }} value={get(this.source, 'time', '@timestamp')} disabled /></Col>
                    <Col span={2}>标题</Col>
                    <Col span={10}><Input defaultValue="时间" data-xaxis={get(this.source, 'time', '@timestamp')} onChange={(e) => this.onTitleXChange(e)} /></Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={2}>Y轴：</Col>
                    <Col span={10}>
                        <Select style={{ width: '100%' }} onChange={(value) => this.onYaxisChange(value)}>
                            {get(this.source, 'fields', []).map((field, key) => {
                                return <Option value={field} key={key}>{field}</Option>
                            }
                            )}
                        </Select></Col>
                    <Col span={2}>标题：</Col>
                    <Col span={10}><Input onChange={(e) => this.onTitleYChange(e.target.value)} /></Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col span={4}>
                        <Button type="primary" style={{ width: '100%' }} onClick={(e) => this.onSave(e.target.value)}>保存</Button>
                    </Col>
                </Row> */}
            </div>
        );
    }
}

export default MetricContent;
