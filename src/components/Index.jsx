import React from 'react';
import { Card, Table } from 'antd';
import BaseComponent from './BaseComponent';

const pagination = {
    defaultPageSize: 5
}

//模拟表格数据
const detail = {
    "userName": "SYSTEM",
    "status": "ACTIVE",
    "test": "demo",
    "idx": "1"
}
const detailString = JSON.stringify(detail);
const result = [{
    key: '1',
    id: 1,
    name: '核心日志报警',
    time: '2017-12-12 13:12:54',
    type: 'A',
    data: detailString
}, {
    key: '2',
    id: 2,
    name: '核心日志报警',
    time: '2017-12-11 13:12:54',
    type: 'B',
    data: detailString
}, {
    key: '3',
    id: 3,
    name: '核心日志报警',
    time: '2017-12-10 13:12:54',
    type: 'C',
    data: detailString
}, {
    key: '4',
    id: 4,
    name: '核心日志报警',
    time: '2017-12-09 13:12:54',
    type: 'D',
    data: detailString
}]
class Index extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            result: []
        }
    }

    render() {
        //配置表格参数
        const columns = [{
            title: '时间',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a href="#">{text}</a>
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type'
        }, {
            title: '详情',
            dataIndex: 'data',
            key: 'data',
            render: (text) => <span className="dataDetail">{text}</span>
        }]
        return (
            <div>
                <Card>
                    首页
                    {this.state.result.length > 0 && <Table columns={columns} dataSource={thi.state.result}></Table>}
                </Card>
            </div>
        );
    }
}

export default Index;
