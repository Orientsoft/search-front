import React from 'react';
import BaseComponent from './BaseComponent';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import * as moment from 'moment';

// 数据结构
// const data = [
//     { title: 'DB', data: [[1, 64], [2, 54], [3, 12], [4, 33], [5, 93], [6, 34], [7, 14], [8, 43], [9, 94], [10, 63], [11, 88]] },
//     { title: 'tploader', data: [[1, 14], [2, 43], [3, 94], [4, 63], [5, 88], [6, 19], [7, 83], [8, 34], [9, 77], [10, 20], [11, 67]] },
//     { title: '中间件', data: [[1, 84], [2, 96], [3, 75], [4, 23], [5, 64], [6, 6], [7, 73], [8, 64], [9, 54], [10, 12], [11, 33]] },
//     { title: '数据库', data: [[1, 34], [2, 77], [3, 20], [4, 67], [5, 12], [6, 4], [7, 63], [8, 88], [9, 19], [10, 83], [11, 34]] }
// ]

const chartConfig = [
    { name: '手机', fileds: {}, type: 'line', title: '中间件', Yaxis: '', Xaxis: '', Ytitle: '数量(万笔)', Xtitle: '时间' },
    { name: '手机', fileds: {}, type: 'histogram', title: 'tploader', Yaxis: '', Xaxis: '', Ytitle: '数量(万笔)', Xtitle: '时间' }
]
@observer class ReactChart extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        this.charts = [];
        this.state = {
            // data: [], 
            chartConfig: []
        }
        this.barChartPlotter = this.barChartPlotter.bind(this);
        this.darkenColor = this.darkenColor.bind(this);
    }

    // @computed get data() {
    //     // const aggs = this.getBuckets(this.queryStore.filterFields[0].field);
    //     var data = [];
    //     data = this.queryStore.filterFields.map((filterField) => {
    //         return this.getBuckets(filterField.field).map(agg => this.getBuckets('@timestamp', {
    //             aggregations: agg
    //         })).reduce((result, buckets) => result.concat(buckets.map(bucket => [
    //             new Date(bucket.key),
    //             bucket.doc_count
    //         ])), []);
    //     })

    //     return data;

    // }

    @computed get data() {
        const aggs = this.getBuckets(this.queryStore.filterFields[0].field);

        return aggs.map(agg => this.getBuckets('@timestamp', {
            aggregations: agg
        })).reduce((result, buckets) => result.concat(buckets.map(bucket => [
            new Date(bucket.key),
            bucket.doc_count
        ])), []);
    }
    // @computed get data() {

    //     return this.queryStore.filterFields.map((filterField) => {
    //         return this.getBuckets(filterField.field).map(agg => this.getBuckets('@timestamp', {
    //             aggregations: agg
    //         })).reduce((result, buckets) => result.concat(buckets.map(bucket => [
    //             new Date(bucket.key),
    //             bucket.doc_count
    //         ])), []);
    //     })
    // }


    render() {
        return (
            <div className="clearfix">
                {
                    // this.state.chartConfig.length > 0 && this.data[0].length > 0 && this.state.chartConfig.map((item, key) => (
                    //     <div key={key} className="chart">
                    //         <div key={key} ref={el => this.initChart(el, key, this.data[key], item)}></div>
                    //     </div>
                    // ))
                }
                {
                    this.state.chartConfig.length > 0 && this.data.length > 0 && this.state.chartConfig.map((item, key) => (
                        <div key={key} className="chart">
                            <div key={key} ref={el => this.initChart(el, key, this.data, item)}></div>
                        </div>
                    ))
                }
            </div>
        );
    }
    componentDidUpdate() {
        if (this.charts.length > 0 && this.charts.length == this.state.chartConfig.length) {
            var sync = Dygraph.synchronize(this.charts);
        }
    }
    initChart(el, key, data, chartConfig) {
        console.log('进入initChart');
        var chart = this.charts[key];
        if (!chart) {
            if (chartConfig.type == 'histogram') {
                chart = new Dygraph(el, data, {
                    labels: ['x', '数量'],
                    drawGrid: false,
                    title: chartConfig.title,
                    height: 200,
                    colors: ['#CC3333'],
                    fillGraph: true,
                    legend: 'follow',
                    // xRangePad: 50,
                    highlightCircleSize: 6,
                    axisLineWidth: 1,
                    ylabel: chartConfig.Ytitle,
                    xlabel: chartConfig.Xtitle,
                    strokeWidth: 2,
                    plotter: this.barChartPlotter,
                    plugins: [
                        new Dygraph.Plugins.Crosshair({
                            direction: "vertical"
                        })
                    ]
                })

            } else if (chartConfig.type == 'line') {
                chart = new Dygraph(el, data, {
                    labels: ['x', '数量'],
                    drawGrid: false,
                    title: chartConfig.title,
                    height: 200,
                    colors: ['#CC3333'],
                    fillGraph: true,
                    // xRangePad: 50,
                    highlightCircleSize: 6,
                    axisLineWidth: 1,
                    ylabel: chartConfig.Ytitle,
                    xlabel: chartConfig.Xtitle,
                    legend: 'follow',
                    // drawAxesAtZero: true, 
                    // includeZero: true, 
                    // strokeWidth: 2,
                    // logscale: true, 
                    // labelsShowZeroValues: true, 
                    plugins: [
                        new Dygraph.Plugins.Crosshair({
                            direction: "vertical"
                        })
                    ]
                })
            }
            this.charts[key] = chart
        }
    }
    darkenColor(colorStr) {
        // Defined in dygraph-utils.js
        var color = Dygraph.toRGB_(colorStr);
        color.r = Math.floor((255 + color.r) / 2);
        color.g = Math.floor((255 + color.g) / 2);
        color.b = Math.floor((255 + color.b) / 2);
        return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    }

    barChartPlotter(e) {
        var ctx = e.drawingContext;
        var points = e.points;
        var y_bottom = e.dygraph.toDomYCoord(0);

        ctx.fillStyle = this.darkenColor(e.color);

        // Find the minimum separation between x-values.
        // This determines the bar width.
        var min_sep = Infinity;
        for (var i = 1; i < points.length; i++) {
            var sep = points[i].canvasx - points[i - 1].canvasx;
            if (sep < min_sep) min_sep = sep;
        }
        var bar_width = Math.floor(2.0 / 3 * min_sep);

        // Do the actual plotting.
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var center_x = p.canvasx;

            ctx.fillRect(center_x - bar_width / 2, p.canvasy,
                bar_width, y_bottom - p.canvasy);

            ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
                bar_width, y_bottom - p.canvasy);


        }

    }

    componentDidMount() {
        if (this.data) {
            this.setState({
                // data: this.data, 
                chartConfig: chartConfig
            })
        }

    }

}

export default ReactChart;
