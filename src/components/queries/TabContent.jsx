import React from 'react';
import { Tabs, Table, Button, Modal, Card, Collapse } from 'antd';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import set from 'lodash/set';
import forEach from 'lodash/forEach';
import BaseComponent from '../BaseComponent';
import ReactChart from '../ReactChart';
import { merge } from 'lodash'

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;


const cols = [
	{ 'field': '@timestamp', 'label': '时间' },
	{ 'field': 'index', 'label': '数据源' },
	{ 'field': 'host', 'label': '主机' },
	{ 'field': 'state', 'label': '状态' },
	{ 'field': 'ThreadActiveCount', 'label': '线程激活数量' },
	{ 'field': 'ServerName', 'label': '主机名' },
	{ 'field': 'ThreadPoolSize', 'label': 'ThreadPoolSize' },
	{ 'field': 'DomainName', 'label': 'DomainName' }
]
@observer class TabContent extends BaseComponent {

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
		this.onPageChange = this.onPageChange.bind(this)
		this.pagination = {
			defaultPageSize: 5,
			showQuickJumper: true,
			onChange: this.onPageChange
		}
	}



	@computed get chartData() {
		return this.appStore.currentAggs.map(agg => {
			return {
				title: agg,
				data: this.getBuckets(agg)
			}
		});
	}

	@computed get columns() {
		var column = cols.map((col, key) => {
			if (key == 0 || key == 1) {
				return {
					title: col['label'],
					dataIndex: col['field'],
					key: col['field'],
					width: 150,
					fixed: 'left',
					render: (text) => <p className="wordBreak" dangerouslySetInnerHTML={{ __html: text }} />
				}
			} else if (key == 2) {
				return {
					title: col['label'],
					dataIndex: col['field'],
					key: col['field'],
					width: 150,
					fixed: 'left',
					render: (text) => <p className="wordBreak" dangerouslySetInnerHTML={{ __html: text }} />
				}
			}
			else if (key >= 3) {
				return {
					title: col['label'],
					dataIndex: col['field'],
					key: col['filed'],
					// width: 250,
					render: (text) => <p className="ellipsis" dangerouslySetInnerHTML={{ __html: text }} />
				}
			}
		})
		column.push({
			title: '详情',
			dataIndex: 'hit',
			key: 'hit',
			width: 100,
			fixed: 'right',
			render: (text) => <Button type="primary" onClick={() => this.showModal(text)}>详情</Button>
		})
		return column;
	}
	
	@computed get tableData() {
		if (!this.state.result.length) {
			this.state.result = this.getHits();
		};
		return this.state.result.map((hit, key) => {
			forEach(hit.highlight, (value, key) => {
				set(hit._source, key, value.toString());
			});

			var fields = cols.map((col, key) => {
				var filed = col.field
				var source = hit._source
				if (filed == 'index') {
					return {
						[filed]: hit._index
					}
				}
				else if (source[filed]) {
					return {
						[filed]: source[filed]
					}
				} else {
					if (source['message'][filed]) {
						return {
							[filed]: source['message'][filed]
						}
					} else if (source['message']['msg'][filed]) {
						return {
							[filed]: source['message']['msg'][filed]
						}
					}

				}

			})

			fields.push({
				hit: hit
			})

			var tableDataObj = fields.reduce((result, item) => merge(result, item), {})

			return tableDataObj
		});
	}

	render() {

		console.log('tableData');
		console.log(this.tableData);
		return (
			<div className="tabContent">
				<Card>
					<Tabs defaultActiveKey="1">
						<TabPane tab="详情" key="1">
							{this.tableData.length > 0 && <Table columns={this.columns} dataSource={this.tableData} pagination={this.pagination} scroll={{ x: 200 * this.columns.length }}  ></Table>}
						</TabPane>
						<TabPane tab="图表" key="2">
							{/* this.chartData.length > 0 && <Chart data={this.chartData} /> */}
							<ReactChart />
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
							<p>{this.state.showModalData._source['@timestamp']}</p>
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
		this.setState({
			visible: true
		})
		this.setState({
			showModalData: text
		})
	}

	componentWillMount() {
		this.pageCount = Math.ceil(this.queryStore.size / this.pagination.defaultPageSize);
	}

	onPageChange(page, pageSize) {
		
		console.log('page=' + page);
		if ( page >= this.pageCount ){
			this.elastic.search(this.queryStore.buildPagination( 5 * (page - 1) + 1).toJSON(), false).then(result => {
				this.setState({
					result: this.state.result.concat(this.getHits(result))
				}, () => this.pageCount = Math.ceil(this.state.result.length / this.pagination.defaultPageSize));
			});
		}
	}

	hideModal() {
		this.setState({
			visible: false
		})
	}
}

export default TabContent;
