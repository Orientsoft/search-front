import React from 'react';
import { Tabs, Table, Button, Modal, Card, Collapse } from 'antd';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import G2 from '@antv/g2';
import Component from './Component';
// import Chart from './Chart';
import ReactChart from './ReactChart'

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const pagination = {
	defaultPageSize: 5
}

@observer class TabContent extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			result: [],
			visible: false,
			showModalData: {
				_source: {}
			}
		}
		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
	}

	@computed get chartData() {
		return this.appStore.currentAggs.map(agg => {
			return {
				title: agg,
				data: this.getBuckets(agg)
			}
		});
	}

	@computed get tableData() {
		return this.getHits().map((hit, key) => {
			return {
				key: '' + key,
				date: hit._source['@TranTime'],
				type: hit._type,
				data: JSON.stringify(hit._source),
				hit: hit
			}
		});
	}

	render() {
		//配置表格参数
		const columns = [{
			title: '时间',
			dataIndex: 'date',
			key: 'date',
			width: '25%'
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
			dataIndex: 'hit',
			key: 'hit',
			width: '5%',
			render: (text) => <Button type="primary" onClick={() => this.showModal(text)}>详情</Button>
		}]
		return (
			<div className="tabContent">
				<Card>
					<Tabs defaultActiveKey="1">
						<TabPane tab="图表" key="1">
							{/* this.chartData.length > 0 && <Chart data={this.chartData} /> */}
							<ReactChart />
						</TabPane>
						<TabPane tab="详情" key="2">
							{this.tableData.length > 0 && <Table columns={columns} dataSource={this.tableData} pagination={pagination} ></Table>}
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
							<p>{this.state.showModalData._source['@TranTime']}</p>
						</div>
						<div className="tabLine">
							<p>类型</p>
							<p>{this.state.showModalData._type}</p>
						</div>
						<div className="tabLineLast">
							<p>数据</p>
							<p className="wordBreak">{JSON.stringify(this.state.showModalData._source)}</p>
						</div>
					</Modal>
				</Card>
			</div>
		);
	}

	showModal(text) {
		console.log(text, typeof text);
		this.setState({
			visible: true
		})
		this.setState({
			showModalData: text
		})
	}
	hideModal() {
		this.setState({
			visible: false
		})
	}
}

export default TabContent;
