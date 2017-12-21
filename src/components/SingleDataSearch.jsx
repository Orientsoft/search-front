import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Tabs, Card } from 'antd';
import get from 'lodash/get';
import Component from './Component';
import SingleDataContent from './SingleDataContent';
import TabContent from './TabContent'
const TabPane = Tabs.TabPane;

@observer class SingleDataSearch extends Component {
    @observable tabs = ['db', 'weblogic', 'tuxedo', '业务', '系统']
    @observable sources = []

    @action.bound onTabChange(key) {
        var category = this.tabs.slice()[key]
        this.showData(category)

    }
    showData(category) {
        this.sources = []
        var singleDatas = this.appStore.singleDatas.slice()
        for (var i = 0; i < singleDatas.length; i++) {
            if (singleDatas[i].category == category) {
                this.sources.push(singleDatas[i])
            }
        }
    }

    componentWillMount() {
        this.elastic.getSingleDataSource().then(result => {
            this.appStore.singleDatas = get(result, 'hits.hits', []).map(data => data._source);
            this.showData(this.tabs[0])
        });


    }

    render() {
        return (
            <div className="workspace">
                <Card className="singleDataSearch">
                    <Tabs defaultActiveKey="0" onChange={(key) => this.onTabChange(key)}>
                        {this.tabs.map((item, key) => {
                            return (
                                <TabPane tab={item} key={key}><SingleDataContent sources={this.sources} /></TabPane>
                            )
                        })}
                    </Tabs>
                </Card>
                <TabContent />
            </div>
        )
    }
}

export default SingleDataSearch;
