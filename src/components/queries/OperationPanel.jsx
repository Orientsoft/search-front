import React from 'react';
import { observable, computed, action } from 'mobx';
import { Tabs, Card } from 'antd';
import BaseComponent from '../BaseComponent';
import SearchPanel from './SearchPanel';

const TabPane = Tabs.TabPane;

class OperationPanel extends BaseComponent {

  @action.bound onTabChange(key) {

  }
  
  render() {
    return (
      <Card>
        <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
          <TabPane tab="核心" key="1"><SearchPanel /></TabPane>
          <TabPane tab="网络" key="2">tab 2</TabPane>
          <TabPane tab="支付" key="3">tab3</TabPane>
        </Tabs>
      </Card>
    )
  }
}

export default OperationPanel;
