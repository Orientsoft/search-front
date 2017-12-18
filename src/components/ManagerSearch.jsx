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
            <Row>
                <Col span={2}>数据类型:</Col>
                <Col span={4}>数据源:</Col>
                <Col span={9}>多字段选择:</Col>
                <Col span={5}>名称:</Col>
            </Row>
            <Row>
                <Col span={2} >
                    <Select defaultValue="DB" style={{ width: '100%' }}>
                        <option value="">DB</option>
                        <option value="">ORACLE</option>
                    </Select>
                </Col>
                <Col span={4} >
                    <Select defaultValue="选择index" style={{ width: '100%' }}>
                        <option value="">选择index</option>
                        <option value="">选择type</option>
                    </Select>
                </Col>
                <Col span={9} >
                    <Select
                        mode="tags"
                        placeholder="Please select"
                        defaultValue={[]}
                        style={{ width: '100%' }}
                    >
                        <option value="" >a</option>
                        <option value="" >b</option>
                    </Select>
                </Col>
                <Col span={5} >
                    <Input /> 
                </Col>
                <Col span={4} >
                    <Button type="primary">保存</Button>
                </Col>
            </Row>
          </div> 
          <div className = 'contentManager'>
          <Row>
                <Col span={2} >
                    <Select defaultValue="" style={{ width: '100%' }}>
                        <option value="">DB</option>
                        <option value="">ORACLE</option>
                    </Select>
                </Col>
                <Col span={4} >
                    <Select defaultValue="" style={{ width: '100%' }}>
                        <option value="">选择index</option>
                        <option value="">选择type</option>
                    </Select>
                </Col>
                <Col span={9} >
                    <Select
                        mode="tags"
                        placeholder="Please select"
                        defaultValue={[]}
                        style={{ width: '100%' }}
                    >
                        <option value="" >a</option>
                        <option value="" >b</option>
                    </Select>
                </Col>
                <Col span={5} >
                    <Input /> 
                </Col>
                <Col span={4} >
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
