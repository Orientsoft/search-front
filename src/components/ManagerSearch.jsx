import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import {Row, Col,Input,Button,Icon,Select,Card } from 'antd';

const option = Select.Option;


@observer class ManagerSearch extends React.Component {

  render() {
    return (
        <Card>
          <p className = 'headerManager'>定义单数据源：</p>
          <Button type="primary" icon="plus">添加数据</Button>
          <div className = 'contentManager'>
            <Row gutter={16}>
                <Col span={3} className="gutter-row">数据类型:</Col>
                <Col span={3} className="gutter-row">数据源:</Col>
                <Col span={9} className="gutter-row">多字段选择:</Col>
                <Col span={5} className="gutter-row">名称:</Col>
            </Row>
            <Row gutter={16}>
                <Col span={3} className="gutter-row">
                    <Select defaultValue="DB" style={{ width: '100%' }}>
                        <option value="" key = ''>DB</option>
                        <option value="" key = ''>ORACLE</option>
                    </Select>
                </Col>
                <Col span={3} className="gutter-row">
                    <Select defaultValue="选择index" style={{ width: '100%' }}>
                        <option value="" key = ''>选择index</option>
                        <option value="" key = ''>选择type</option>
                    </Select>
                </Col>
                <Col span={9} className="gutter-row">
                    <Select
                        mode="tags"
                        placeholder="Please select"
                        defaultValue={[]}
                        style={{ width: '100%' }}
                    >
                        <option value="" key = ''>a</option>
                        <option value="" key = ''>b</option>
                    </Select>
                </Col>
                <Col span={5} className="gutter-row">
                    <Input /> 
                </Col>
                <Col span={4} className="gutter-row">
                    <Button type="primary">保存</Button>
                </Col>
            </Row>
          </div> 
          <div className = 'contentManager'>
          <Row gutter={16}>
                <Col span={3} className="gutter-row">
                    <Select defaultValue="" style={{ width: '100%' }}>
                        <option value="" key = ''>DB</option>
                        <option value="" key = ''>ORACLE</option>
                    </Select>
                </Col>
                <Col span={3} className="gutter-row">
                    <Select defaultValue="" style={{ width: '100%' }}>
                        <option value="" key = ''>选择index</option>
                        <option value="" key = ''>选择type</option>
                    </Select>
                </Col>
                <Col span={9} className="gutter-row">
                    <Select
                        mode="tags"
                        placeholder="Please select"
                        defaultValue={[]}
                        style={{ width: '100%' }}
                    >
                        <option value="" key = ''>a</option>
                        <option value="" key = ''>b</option>
                    </Select>
                </Col>
                <Col span={5} className="gutter-row">
                    <Input /> 
                </Col>
                <Col span={4} className="gutter-row">
                    <Button>编辑</Button>
                    <Button>删除</Button>
                </Col>
            </Row>
          </div>
        </Card>
    )
  }
}

export default ManagerSearch
