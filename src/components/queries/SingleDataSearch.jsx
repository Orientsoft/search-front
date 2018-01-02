import React from 'react';
import { observable, computed, action } from 'mobx';
import { Tabs, Card } from 'antd';
import get from 'lodash/get';
import BaseComponent from '../BaseComponent';
import SingleDataContent from '../manages/SourceContent';
import TabContent from './TabContent';
import SearchPanel from './SearchPanel';

const TabPane = Tabs.TabPane;

class SingleDataSearch extends BaseComponent {
    @observable tabs = []
    @observable allDatas = []
    // @observable sources = []

    @action.bound onTabChange(key) {
        
    }
    // showData(category) {
    //     this.sources = []
    //     var singleDatas = this.appStore.singleDatas.slice()
    //     for (var i = 0; i < singleDatas.length; i++) {
    //         if (singleDatas[i].category == category) {
    //             this.sources.push(singleDatas[i])
    //         }
    //     }
    // }
    showDatas (){
        this.tabs = []
        this.elastic.getSingleDataSource().then(result => {
            this.allDatas = get(result, 'hits.hits', []).map(data => data._source);
            for(var i =0; i<this.allDatas.length;i++){
                if(this.allDatas[i].category == this.appStore.singleDataType){
                    this.tabs.push(this.allDatas[i].name)
                }
            }
        });
    }

    componentWillMount() {
        this.showDatas()
    }
    shouldComponentUpdate() {
        this.showDatas()
    }

    render() {
        return (
            <div className="workspace">
                <Card className="singleDataSearch">
                    <Tabs defaultActiveKey="0" onChange={(key) => this.onTabChange(key)}>
                        {this.tabs.slice().map((item, key) => {
                            return (
                                <TabPane tab={item} key={key}><SearchPanel/></TabPane>
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
