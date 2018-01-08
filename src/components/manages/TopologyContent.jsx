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
    @observable.ref nodes = [];

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
        width: '35%',
        render: (_, record) => <div style={{ textAlign: 'center' }}>{record.data.src}</div>
    }, {
        key: 'target',
        dataIndex: 'target',
        title: <div style={{ textAlign: 'center' }}>目标</div>,
        width: '35%',
        render: (_, record) => <div style={{ textAlign: 'center' }}>{record.data.target}</div>
    }, {
        key: 'opt',
        dataIndex: 'opt',
        title: <div style={{ textAlign: 'center' }}>操作</div>,
        width: '20%',
        render: (_, record, index) => (
            <Row type="flex" justify="center" gutter={10}>
                <Col>
                    <Button type="primary" onClick={() => this.onEditNode(index)}>编辑</Button>
                </Col>
                <Col>
                    <Button type="danger" onClick={() => this.onDeleteNode(index)}>删除</Button>
                </Col>
            </Row>
        )
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
    }

    onChildChanged(childs) {
        this.postData.nodes = compact(childs.map(child => {
            const node = this.nodes.find(node => node.data.src === child);

            return node ? node.data : null;
        }));
        this.forceUpdate();
    }

    onEditNode(index) {
        // 进入编辑模式
        this.liveMode = true;
        // 当前编辑的节点
        this.postData = this.nodes[index].data;
        this.props.setVisible(true);
    }

    onDeleteNode(index) {
        const node = this.nodes[index];
        this.elastic.deleteNode(node.data.src).then(() => {
            // 调整索引
            for (let i = index + 1; i < this.nodes.length; i++) {
                --this.nodes[i].key;
            }
            this.nodes.splice(index, 1);
        });
    }

    onSave() {
        let result;

        if (this.liveMode) {
            result = this.elastic.updateNode(this.postData.src, this.postData).then(() => {
                this.liveMode = false;
            });
        } else {
            result = this.elastic.saveNode(this.postData.src, this.postData).then(action(result => {
                this.nodes.push({
                    key: this.nodes.length,
                    data: this.postData
                });
            }));
        }
        result.then(() => {
            this.postData = {};
            this.props.setVisible(false);
        });
    }

    onCancel() {
        this.postData = {};
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
                            <Input value={this.postData.src} disabled={this.liveMode} onChange={(e) => this.onNameChange(e.target.value)} />
                        </FormItem>
                        <FormItem {...this.formItemLayout} label='节点类型：'>
                            <Select style={{ width: '100%' }} disabled={this.liveMode} defaultValue={this.postData.level} onChange={(value) => this.onLevelChanged(value)}>
                                {this.levels.map((level, key) => <Option key={key} value={level.value}>{level.name}</Option>)}
                            </Select>
                        </FormItem>
                        <FormItem {...this.formItemLayout} label='目标节点：'>
                            <Select style={{ width: '100%' }} defaultValue={this.postData.target} onChange={(value) => this.onTagetChanged(value)}>
                                {compact(this.nodes.map((node, key) => {
                                    if (node.data.level === this.postData.level && node.data.src !== this.postData.src) {
                                        return <Option key={key} value={node.data.src}>{node.data.src}</Option>
                                    }
                                    return null;
                                }))}
                            </Select>
                        </FormItem>
                        <FormItem {...this.formItemLayout} label='子节点：'>
                            <Select style={{ width: '100%' }} mode="multiple" defaultValue={compact(get(this.postData, 'nodes', []).map(node => node.src))} onChange={(value) => this.onChildChanged(value)}>
                                {compact(this.nodes.map((node, key) => {
                                    if (node.data.level === this.postData.level + 1) {
                                        return <Option key={key} value={node.data.src}>{node.data.src}</Option>
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
