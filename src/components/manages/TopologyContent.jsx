import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col, Select, Input, Button, Modal, Form, Table } from 'antd';
import get from 'lodash/get';
import compact from 'lodash/compact';
import BaseComponent from '../BaseComponent';

const Option = Select.Option;
const confirm = Modal.confirm;
const FormItem = Form.Item;

@observer class TopologyContent extends BaseComponent {
    // 所有节点
    @observable nodes = [];

    levels = [{
        name: '一级节点',
        value: 1
    }, {
        name: '二级节点',
        value: 2
    }];

    formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };

    columns = [{
        key: 'level',
        dataIndex: 'level',
        title: <div style={{ textAlign: 'center' }}>类型</div>,
        width: '10%',
        render: (_, record) => {
            const level = this.levels.filter(level => level.value === record.data.level)[0];
            return <div style={{ textAlign: 'center' }}>{level ? level.name : 'UNKNOWN'}</div>
        }
    }, {
        key: 'src',
        dataIndex: 'src',
        title: <div style={{ textAlign: 'center' }}>名称</div>,
        width: '40%',
        render: (_, record) => <div style={{ textAlign: 'center' }}>{record.data.src}</div>
    }, {
        key: 'target',
        dataIndex: 'target',
        title: <div style={{ textAlign: 'center' }}>目标</div>,
        width: '40%',
        render: (_, record) => <div style={{ textAlign: 'center' }}>{record.data.target}</div>
    }, {
        key: 'opt',
        dataIndex: 'opt',
        title: <div style={{ textAlign: 'center' }}>操作</div>,
        width: '10%',
        render: (_, record, index) => <div style={{ textAlign: 'center' }}><Button type="danger" onClick={() => this.onDeleteNode(index)}>删除</Button></div>
    }];

    onNameChange(name) {
        this.postData.src = name.trim();
        this.forceUpdate();
    }

    onLevelChanged(level) {
        this.postData.level = level;
        this.forceUpdate();
    }

    onTagetChanged(target) {
        this.postData.target = target;
        console.log(target);
    }

    onChildChange(childs) {
        this.postData.nodes = childs.map(child => this.nodes[child]);
        this.forceUpdate();
        console.log(this.postData.nodes);
    }

    onDeleteNode(index) {
        console.log('delete node: ', index);
    }

    onSave() {
        this.elastic.saveNode(this.postData.src, this.postData).then(action(result => {
            this.nodes.push({
                key: this.nodes.length,
                data: this.postData
            });
        }));
        this.props.setVisible(false);
    }

    onCancel() {
        this.props.setVisible(false);
    }

    componentWillMount() {
        this.elastic.getNodes().then(action(result => {
            this.nodes = this.getHits(result).map((node, key) => {
                return {
                    key,
                    data: node._source
                }
            });
        }));
    }

    render() {
        return (
            <div>
                <Modal
                    title="添加节点"
                    visible={this.props.visible}
                    onOk={this.onSave.bind(this)}
                    onCancel={this.onCancel.bind(this)}>
                    <Form horizonal='true'>
                        <FormItem {...this.formItemLayout} label='节点名称：'>
                            <Input onChange={(e) => this.onNameChange(e.target.value)} />
                        </FormItem>
                        <FormItem {...this.formItemLayout} label='节点类型：'>
                            <Select style={{ width: '100%' }} onChange={(value) => this.onLevelChanged(value)}>
                                {this.levels.map((level, key) => <Option key={key} value={level.value}>{level.name}</Option>)}
                            </Select>
                        </FormItem>
                        <FormItem {...this.formItemLayout} label='目标节点：'>
                            <Select style={{ width: '100%' }} onChange={(value) => this.onTagetChanged(value)}>
                                {compact(this.nodes.map((node, key) => {
                                    if (node.data.level === this.postData.level && node.data.src !== this.postData.src) {
                                        return <Option key={key} value={node.data.src}>{node.data.src}</Option>
                                    }
                                    return null;
                                }))}
                            </Select>
                        </FormItem>
                        <FormItem {...this.formItemLayout} label='子节点：'>
                            <Select style={{ width: '100%' }} mode="multiple" onChange={(value) => this.onChildChanged(value)}>
                                {compact(this.nodes.map((node, key) => {
                                    if (node.data.level === this.postData.level + 1) {
                                        return <Option key={key} value={node.key}>{node.data.src}</Option>
                                    }
                                    return null;
                                }))}
                            </Select>
                        </FormItem>
                    </Form>
                </Modal>
                <Table columns={this.columns} dataSource={this.nodes.slice()} />
            </div>
        );
    }
}

export default TopologyContent;
