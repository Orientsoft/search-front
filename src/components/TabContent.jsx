import React from 'react';
import { Tabs, Table, Button, Modal, Card, Collapse } from 'antd';
import { observer } from 'mobx-react';
import G2 from '@antv/g2';
import Chart from './Chart';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const pagination = {
	defaultPageSize: 5
}

//模拟表格数据
const detail = {
	"userName": "SYSTEM",
	"status": "ACTIVE",
	"test": "demo",
	"idx": "1",
	"code": "12334553",
	"name": 'cdgbdsdh'
}
const detailString = JSON.stringify(detail);
const result = [{
	hit: {
		time: '2017-12-12 13:12:54',
		type: 'A',
		data: detailString
	},
	key: '1',
	id: 1,
	time: '2017-12-12 13:12:54',
	type: 'A',
	data: detailString
}, {
	hit: {
		time: '2017-12-11 13:12:54',
		type: 'B',
		data: detailString
	},
	key: '2',
	id: 2,
	time: '2017-12-11 13:12:54',
	type: 'B',
	data: detailString
}, {
	hit: {
		time: '2017-12-10 13:12:54',
		type: 'C',
		data: detailString
	},
	key: '3',
	id: 3,
	time: '2017-12-10 13:12:54',
	type: 'C',
	data: detailString
}, {
	hit: {
		time: '2017-12-09 13:12:54',
		type: 'D',
		data: detailString
	},
	key: '4',
	id: 4,
	time: '2017-12-09 13:12:54',
	type: 'D',
	data: detailString
}, {
	hit: {
		time: '2017-12-13 13:12:54',
		type: 'E',
		data: detailString
	},
	id: 5,
	key: '5',
	time: '2017-12-13 13:12:54',
	type: 'E',
	data: detailString
}, {
	hit: {
		time: '2017-12-14 13:12:54',
		type: 'F',
		data: detailString
	},
	id: 6,
	key: '6',
	time: '2017-12-14 13:12:54',
	type: 'F',
	data: detailString
}]

//模拟图表数据,以小时为X轴
const chartData = [
	{ title: '中间件', data: [{ "key": "0点", "doc_count": 100 }, { "key": '1点', "doc_count": 124 }, { "key": "2点", "doc_count": 329 }, { "key": "3点", "doc_count": 453 }, { "key": "4点", "doc_count": 315 }] },
	{ title: '数据库', data: [{ "key": "0点", "doc_count": 300 }, { "key": '1点', "doc_count": 179 }, { "key": "2点", "doc_count": 429 }, { "key": "3点", "doc_count": 123 }, { "key": "4点", "doc_count": 234 }] },
	{ title: 'tploader', data: [{ "key": "0点", "doc_count": 400 }, { "key": '1点', "doc_count": 201 }, { "key": "2点", "doc_count": 532 }, { "key": "3点", "doc_count": 234 }, { "key": "4点", "doc_count": 123 }] },
	{ title: '核心', data: [{ "key": "0点", "doc_count": 378 }, { "key": '1点', "doc_count": 302 }, { "key": "2点", "doc_count": 136 }, { "key": "3点", "doc_count": 128 }, { "key": "4点", "doc_count": 532 }] },
]

@observer class TabContent extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			result: result,
			chartData: chartData,
			visible: false,
			showModalData: {}
		}
		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
	}

	render() {
		//配置表格参数
		const columns = [{
			title: '时间',
			dataIndex: 'time',
			key: 'time',
			width: '20%'
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			width: '10%',
		}, {
			title: '数据',
			dataIndex: 'data',
			key: 'data',
			width: '60%',
			render: (text) => <p className="wordBreak">{text}</p>
		}, {
			title: '详情',
			dataIndex: 'id',
			key: 'id',
			width: '10%',
			render: (text) => <Button type="primary" detail_id={text} onClick={this.showModal}>详情</Button>
		}]
		return (
			<div className="tabContent">
				<Card>
					<Tabs defaultActiveKey="1">
						<TabPane tab="图表" key="1">
							<Chart data={this.state.chartData} />
						</TabPane>
						<TabPane tab="详情" key="2">
							{this.state.result.length > 0 && <Table columns={columns} dataSource={this.state.result} pagination={pagination} ></Table>}
						</TabPane>

					</Tabs>
					<Modal
						title="数据详情"
						visible={this.state.visible}
						footer={null}
						onCancel={this.hideModal}
					>
						<div className="tabLine">
							<p>时间</p>
							<p>{this.state.showModalData.time}</p>
						</div>
						<div className="tabLine">
							<p>类型</p>
							<p>{this.state.showModalData.type}</p>
						</div>
						<div className="tabLineLast">
							<p>数据</p>
							<p className="wordBreak">{this.state.showModalData.data}</p>
						</div>
					</Modal>
				</Card>
			</div>
		);
	}

	showModal(e) {
		this.setState({
			visible: true
		})
		var id = e.target.getAttribute('detail_id');
		for (var i = 0; i < result.length; i++) {
			if (result[i].id == id) {
				this.setState({
					showModalData: result[i].hit
				})
			}
		}
	}
	hideModal() {
		this.setState({
			visible: false
		})
	}
}

export default TabContent;
