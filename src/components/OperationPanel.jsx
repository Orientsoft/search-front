import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Tabs, Card } from 'antd';
import Component from './Component';
import SearchPanel from './SearchPanel';

const TabPane = Tabs.TabPane;

@observer class OperationPanel extends Component {

  @action.bound onTabChange(key) {

  }
  
  render() {
    return (
      <Card>
        <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
          <TabPane tab="核心" key="1"><SearchPanel /></TabPane>
          <TabPane tab="网络" key="2">Content of Tab Pane 2</TabPane>
          <TabPane tab="支付" key="3">Content of Tab Pane 3</TabPane>
        </Tabs>
      </Card>
    )
  }
}

export default OperationPanel;
