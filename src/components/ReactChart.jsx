import React from 'react';
import BaseComponent from './BaseComponent';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import get from 'lodash/get';
import * as moment from 'moment';

// const chartConfig = [
//     { name: '手机', fileds: {}, type: 'line', title: '中间件', Yaxis: '', Xaxis: '', Ytitle: '数量(万笔)', Xtitle: '时间' },
//     { name: '手机', fileds: {}, type: 'histogram', title: 'tploader', Yaxis: '', Xaxis: '', Ytitle: '数量(万笔)', Xtitle: '时间' }
// ];

@observer class ReactChart extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        this.charts = [];
        this.state = {
            // data: [], 
            // chartConfig: []
        }
        this.barChartPlotter = this.barChartPlotter.bind(this);
        this.darkenColor = this.darkenColor.bind(this);
    }

    @computed get data() {
        const buckets = this.getBuckets('@timestamp');
        const result = this.queryStore.filterFields.map(() => []);

        var data = buckets.reduce((result, bucket) => {
            this.queryStore.filterFields.forEach((field, key) => {
                result[key].push([
                    new Date(bucket.key),
                    get(bucket[field.field], 'value', 0)
                ])
            });
            return result;
        }, result);
        return data
    }

    @computed get chartConfig () {
        var chartConfig = this.appStore.selectedConfig.metrics.map((metric)=>{
            return {
                title: metric.chart.title,
                type: metric.chart.type, 
                Xtitle: metric.chart.x.label, 
                Ytitle: metric.chart.y.label
            }
        })
        return chartConfig;
    }
    render() {
        return (
            <div className="clearfix">
                {this.chartConfig.length > 0 && this.data.length > 0 && this.chartConfig.map((item, key) => (
                    <div key={key} className="chart">
                        <div key={key} ref={el => this.initChart(el, key, this.data[key], item)}></div>
                    </div>
                ))}
            </div>
        );
    }

    componentDidUpdate() {
        if (this.charts.length > 0 && this.charts.length == this.chartConfig.length && this.chartConfig.length >= 2) {
            const sync = Dygraph.synchronize(this.charts);
        }
    }

    initChart(el, key, data, chartConfig) {
        let chart = this.charts[key];
        if (!chart) {
            if (chartConfig.type == 'bar') {
                chart = new Dygraph(el, data, {
                    labels: ['x', chartConfig.Ytitle],
                    drawGrid: false,
                    title: chartConfig.title,
                    height: 300,
                    colors: ['#CC3333'],
                    fillGraph: true,
                    legend: 'follow',
                    // xRangePad: 50,
                    highlightCircleSize: 6,
                    axisLineWidth: 1,
                    ylabel: chartConfig.Ytitle,
                    // xlabel: chartConfig.Xtitle,
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
                    labels: ['x', chartConfig.Ytitle],
                    drawGrid: false,
                    title: chartConfig.title,
                    height: 300,
                    xLabelHeight: 22, 
                    colors: ['#CC3333'],
                    fillGraph: true,
                    // xRangePad: 50,
                    highlightCircleSize: 6,
                    axisLineWidth: 1,
                    ylabel: chartConfig.Ytitle,
                    // xlabel: chartConfig.Xtitle,
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
        }else {
            chart.updateOptions({'file':data})
        }
    }

    darkenColor(colorStr) {
        // Defined in dygraph-utils.js
        const color = Dygraph.toRGB_(colorStr);
        color.r = Math.floor((255 + color.r) / 2);
        color.g = Math.floor((255 + color.g) / 2);
        color.b = Math.floor((255 + color.b) / 2);
        return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    }

    barChartPlotter(e) {
        let ctx = e.drawingContext;
        let points = e.points;
        let y_bottom = e.dygraph.toDomYCoord(0);

        ctx.fillStyle = this.darkenColor(e.color);

        // Find the minimum separation between x-values.
        // This determines the bar width.
        let min_sep = Infinity;
        for (let i = 1; i < points.length; i++) {
            let sep = points[i].canvasx - points[i - 1].canvasx;
            if (sep < min_sep) min_sep = sep;
        }
        let bar_width = Math.floor(2.0 / 3 * min_sep);

        // Do the actual plotting.
        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            let center_x = p.canvasx;

            ctx.fillRect(center_x - bar_width / 2, p.canvasy,
                bar_width, y_bottom - p.canvasy);

            ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
                bar_width, y_bottom - p.canvasy);


        }

    }

    componentDidMount() {
        
    }
}

export default ReactChart;
