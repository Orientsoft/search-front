import React from 'react';
import Component from './Component';

//数据结构
var data = [
    {title: 'DB', data: [[0, 73], [1, 64], [2, 54], [3, 12], [4, 33], [5, 93], [6, 34], [7, 14], [8, 43], [9, 94], [10, 63], [11, 88]]}, 
    {title: 'tploader', data: [[0, 13], [1, 14], [2, 43], [3, 94], [4, 63], [5, 88], [6, 19], [7, 83], [8, 34], [9, 77], [10, 20], [11, 67]]}, 
    {title: '中间件', data: [[0, 33], [1, 84], [2, 96], [3, 75], [4, 23], [5, 64], [6, 6], [7, 73], [8, 64], [9, 54], [10, 12], [11, 33]]}, 
    {title: '数据库', data:[[0, 83], [1, 34], [2, 77], [3, 20], [4, 67], [5, 12], [6, 4], [7, 63], [8, 88], [9, 19], [10, 83], [11, 34]]}
]

class ReactChart extends Component {
    constructor(props, context) {
        super(props, context);
        this.charts = [];
        this.state = {
            data: []
        }
    }

    render() {
        return (
            <div className="clearfix">
                {this.state.data.length > 0 && this.state.data.map((item, key) => (
                    <div key={key} className="chart">
                        <div key={key} ref={el => this.initChart(el, key, item.data, item.title)} ></div>
                    </div>
                ))}
            </div>
        );
    }
    componentDidUpdate() {
       var sync = Dygraph.synchronize(this.charts);
    }
    initChart(el, key, data, title) {
        var chart = this.charts[key];
        if (!chart) {
            chart = new Dygraph(el, data, {
                labels: ['x', '数量'],
                drawGrid: false, 
                title: title,
                height: 200,
                colors: ['#CC3333'], 
                xRangePad: 5
            })
            this.charts[key] = chart
        }
    }

    componentDidMount(){
        this.setState({
            data: data
        })
    }

}

export default ReactChart;
