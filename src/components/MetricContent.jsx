import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col, Select, Input, Button, Modal } from 'antd';
import get from 'lodash/get';
import BaseComponent from './BaseComponent';
import getFields from '../utils/fields';
const Option = Select.Option;
const confirm = Modal.confirm;


@observer class MetricContent extends BaseComponent {
    //select option
    @observable.ref types = ['db', 'weblogic', 'tuxedo', '业务', '系统']
    @observable.ref fields = []
    @observable.ref indices = []
    @observable.ref time = []
    @observable dataSource = []
    @observable enableEdit = []
    //select 显示的value
    @observable keys = []
    @observable originname = ''
    @observable category = ''
    @observable index = ''
    @observable ts = ''


    // 需要提交保存的数据
    data = { category: '', index: '', fields: [], name: '', time: [] }
    name = ''

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.elastic.getSingleDataSource().then(result => {
            this.dataSource = get(result, 'hits.hits', []).map(data => data._source);
            this.enableEdit = Array(this.dataSource.length);
        });
        this.elastic.catIndices().then(action(indices => {
            this.indices = indices.map((index) => index.index);
        }));
    }

    getAllKeys(index) {
        this.elastic.getIndices(index).then(action(result => {
            const mappings = get(result, [index, 'mappings'], {});
            const type = Object.keys(mappings)[0];

            this.fields = getFields(mappings[type]);
            for (let key in this.fields) {
                if (this.fields[key] == "@timestamp") {
                    this.time.push(this.fields[key])
                }
            }
            console.log(' this.fields', this.fields);
        }));
    }

    onTypeChange(type) {
        this.data.category = type;
        this.category = type
    }

    onIndexChange(index) {
        this.data.index = index;
        this.fields = []
        this.time = []
        this.ts = []
        this.keys = []
        this.index = index;
        this.getAllKeys(index)
    }

    onTimeChange(value) {
        this.data.time = value;
        this.ts = value;
    }

    onKeyChange(value) {
        this.data.fields = value;
        this.keys = value;
    }

    onNameChange(value) {
        this.data.name = value;
        this.originname = value;
    }

    onEditType(type) {
        this.data.category = type;
    }

    onEditIndex(index) {
        this.data.index = index;
        this.getAllKeys(index)
    }

    onEditTime(value) {
        this.getAllKeys(this.data.index)
        this.data.time = value;
    }

    onEditKey(value) {
        this.getAllKeys(this.data.index)
        this.data.fields = value;
    }

    onSave() {
        this.elastic.saveSingleDataSource(this.data.name, this.data);
        this.dataSource.push(this.data);

        this.enableEdit.push(false);
        this.fields = []
        this.time = []
        this.data = {}

        this.keys = []
        this.category = ''
        this.index = ''
        this.ts = ''
        this.originname = ''

    }

    onSaveChange(key, name) {
        console.log("this.data", this.data)
        this.elastic.updateSingleDataSource(this.data.name, this.data);
        // for(let i=0; i< this.dataSource.length;i++){
        //     if(this.dataSource[i].name == name){
        //         // this.dataSource[i] = this.data
        //         this.appStore.singleDatas[i] = this.data
        //     }
        // }
        // this.dataSource.push(this.data);
        // this.data = {}

        this.enableEdit[key] = false;
        this.fields = []
        this.time = []
        this.data = {}
    }

    render() {
        return (
            <div>
                <div>
                    
                </div>
            </div>
        );
    }

    @action.bound onItemSave(data) {
        this.dataSource.push(data);
        this.enableEdit.push(false);
    }

    @action onDeleteSource(key) {
        const source = this.dataSource.splice(key, 1)[0];
        this.appStore.singleDatas = this.dataSource
        this.enableEdit[key] = false;
        this.elastic.deleteSingleDataSource(source.name);
    }

    @action onEditSource(key, name) {
        let that = this
        this.name = name
        for (var i = 0; i < this.dataSource.length; i++) {
            if (name == this.dataSource[i].name) {
                this.data = this.dataSource[i]
            }
        }
        confirm({
            title: 'edit',
            content: 'Are you sure to edit ' + name + ' ?',
            onOk() {
                that.enableEdit[key] = true;
            },
            onCancel() {
                console.log('Cancel');
            },
        })
        // this.enableEdit[key] = true;
    }
}

export default MetricContent;



