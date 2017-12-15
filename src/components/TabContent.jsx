import React from 'react';
import { Tabs, Table, Button, Modal, Card } from 'antd';
import { observer } from 'mobx-react';
import G2 from '@antv/g2';

const TabPane = Tabs.TabPane;
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

//模拟图表数据
const chartData = [{
		"key": "7月份",
		"doc_count": 100
	},
	{
		"key": '8月份',
		"doc_count": 124
	},
	{
		"key": "9月份",
		"doc_count": 329
	},
	{
		"key": "10月份",
		"doc_count": 453
	}, {
		"key": "11月份",
		"doc_count": 315
	}, {
		"key": "12月份",
		"doc_count": 136
	}

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
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type'
		}, {
			title: '数据',
			dataIndex: 'data',
            key: 'data', 
            render: (text)=> <span className="dataDetail">{text}</span>
		}, {
			title: '详情',
			dataIndex: 'id',
			key: 'id',
			render: (text) => <Button type="primary" detail_id={text} onClick={this.showModal}>详情</Button>
		}]
		return(
			<div className="tabContent">
			<Card>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="详情" key="1">
                        {this.state.result.length > 0 && <Table columns={columns} dataSource={this.state.result} pagination={pagination} ></Table>}
                    </TabPane>
                    <TabPane tab="图表" key="2">
                        <div ref={(el) => this.initChart(el)} />
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
                        <p className="modalData">{this.state.showModalData.data}</p>
                    </div>
                </Modal>
            </Card>
			</div>
		);
	}

	initChart(el) {
		if(!this.chart) {
			this.chart = new G2.Chart({
				container: el, // 指定图表容器 ID
				forceFit: true,
				height: 300 // 指定图表高度
			});
		}
		this.chart.clear();

		if(this.state.chartData.length > 0) {
			// Step 2: 载入数据源
			this.chart.source(this.state.chartData);
			// Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
			this.chart.interval().position('key*doc_count').color('key')
			// Step 4: 渲染图表
			this.chart.render();
		}
	}
	showModal(e) {
		this.setState({
			visible: true
        })
        var id = e.target.getAttribute('detail_id');
        for(var i = 0; i < result.length; i++){
            if (result[i].id == id){
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
