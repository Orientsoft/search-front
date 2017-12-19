import React from 'react';
import isEqual from 'lodash/isEqual';
import Component from './Component';

class Chart extends Component {
    constructor(props, context) {
        super(props, context);
        this.charts = []
    }
    
    render() {
        const { data = [] } = this.props
        return (
            <div>
                {data.map((item, key) => (
                    <div key={key}>
                        <p>{item.title}</p>
                        <div key={key} ref={el => this.initChart(el, key, item.data)}></div>
                    </div>
                ))}
            </div>
        );
    }

    shouldComponentUpdate(newProps) {
        return !isEqual(newProps.data, this.props.data);
    }

    
	initChart(el, key, data = []) {
		let chart = this.charts[key];
		if (!chart) {
			chart = new G2.Chart({
				container: el, // 指定图表容器 ID
                // forceFit: true,
                width: 850,
				height: 300, // 指定图表高度
			});
		}
		chart.clear();
		// Step 2: 载入数据源
		if (data.length > 0) {
			chart.source(data, {
				key_as_string: {
					alias: '时间（单位/小时）',
                    range: [0, 1], 
				},
				doc_count: {
                    alias: '数量'
				}
			});
			chart.tooltip({
				crosshairs: {
					type: 'line'
				}
            });
            chart.axis('key_as_string', {
                title: {
                    
                }
            });
            chart.axis('doc_count', {
                title: {}
            })
			chart.line().position('key_as_string*doc_count').size(2);
			chart.render();
		}

	}
}

export default Chart;