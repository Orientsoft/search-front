import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col, Select, Input, Button, Modal, Form } from 'antd';
import get from 'lodash/get';
import BaseComponent from '../BaseComponent';

const Option = Select.Option;
const confirm = Modal.confirm;
const FormItem = Form.Item;

@observer class TopologyContent extends BaseComponent {

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

    onNameChange(name) {

    }

    onLevelChanged(level) {

    }

    onSave() {
        this.props.setVisible(false);
    }

    onCancel() {
        this.props.setVisible(false);
    }

    render() {
        return (
            <Modal
                title="添加节点"
                visible={this.props.visible}
                onOk={this.onSave.bind(this)}
                onCancel={this.onCancel.bind(this)}>
                <Form horizonal='true'>
                    <FormItem {...this.formItemLayout} label='节点名：'>
                        <Input onChange={(e) => this.onNameChange(e.target.value)} />
                    </FormItem>
                    <FormItem {...this.formItemLayout} label='节点层级：'>
                        <Select style={{ width: '100%' }} onChange={(value) => this.onLevelChanged(value)}>
                            {this.levels.map((level, key) => <Option key={key} value={level.value}>{level.name}</Option>)}
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default TopologyContent;
