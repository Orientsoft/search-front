import React from 'react';
import { Row, Col, Form, Checkbox, Button, Select, DatePicker } from 'antd';
import { observable, action, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import flattenDeep from 'lodash/flattenDeep';
import * as moment from 'moment';
import BaseComponent from '../BaseComponent';

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
    labelCol: {
        span: 2
    },
    wrapperCol: {
        span: 22
    }
};

@observer class SearchPanel extends BaseComponent {
    // 时间粒度
    timeSize = 'minute';
    // 时间格式，'x'表示Unix毫秒时间戳
    timeFormat = 'x';
    // 过滤字段
    @observable.ref filterFields = []

    /**
     * 限制时间选择范围
     * 如果时间大于当前时间，则禁止选中
     */
    onDisabledTime(date, type) {
        // 返回指定的范围
        const range = (start = 0, end = 60) => Array(end - start).fill(1).map((v, i) => i + start + v);
        
        // 如果开始日期或结束日期都是当天，则禁止选中当前时间之后的时间段
        if (moment().isSame(date, 'day')) {
            return {
                disabledHours: () => range(moment().hours(), 24),
                disabledMinutes: () => range(moment().minutes(), 60),
                disabledSeconds: () => range(moment().seconds(), 60)
            };
        }
    }

    /**
     * 限制日期选择范围
     * 如果日期大于当前日期，则禁止选中
     */
    onDisabledDate(date, type) {
        const { startMoment, endMoment } = this.queryStore;

        if (type === 'start') {
            return endMoment.isBefore(date, this.timeSize);
        }

        return date.isBefore(startMoment, this.timeSize) || date.isAfter(moment(), this.timeSize);
    }

    /**
     * ionRangeSlider插件拖动完成回调
     * 松开鼠标时更新全局日期时间范围
     */
    @action.bound onDateTimeSliderFinish(data) {
        this.queryStore.startMoment = moment(data.from);
        this.queryStore.endMoment = moment(data.to);
    }

    /**
     * 初始化ionRangeSlider插件
     */
    onInitDateTimeSlider(el) {
        const { startMoment, endMoment, momentFormat } = this.queryStore;

        // 清除旧配置，重新加载插件
        if (this.slider) this.slider.destroy();

        jQuery(el).ionRangeSlider({
            type: 'double',
            grid: true,
            to_shadow: true,
            force_edges: true,
            to_max: +endMoment,
            max: +endMoment.clone().endOf('day'),
            min: +startMoment.clone().startOf('day'),
            prettify: date => moment(date, this.timeFormat).locale('zh-cn').format(momentFormat),
            onFinish: this.onDateTimeSliderFinish
        });
        
        this.slider = jQuery(el).data('ionRangeSlider');        
        // 插件没有添加到真实DOM之前，获取不到slider，此处需要判断是否slider已显示
        // 如果slider已经显示在页面上，则更新它的日期时间范围
        if (this.slider) {
            this.slider.update({
                from: +startMoment,
                to: +endMoment
            });
        }
    }

    onFieldChange(field) {
        
    }

    onSearch(value) {
        const requestBody = this.requestBody.highlight(['message.msg.ThreadActiveCount']);
        requestBody.add(this.queryStore.buildSearch());
        return this.elastic.search(requestBody.toJSON());
    }

    @action.bound onDateTimeChange(date, type) {
        const { startMoment, endMoment } = this.queryStore;
        // 如果开始日期被改变，需要判断选择的日期时间是否比结束日期时间大
        // 例如:
        // 开始日期：2017-12-21 15:30
        // 结束日期：2017-12-21 15:35
        // 当在15:40改变开始时间，开始时间可以选中15:40，而结束时间是15:35，这时候应该调整结束时间
        if (type === 'start') {
            if (endMoment.isBefore(date, this.timeSize)) {
                this.queryStore.endMoment = moment();
            }
            this.queryStore.startMoment = date;
        } else {
            // 如果结束日期时间被改变，需要限制它不能早于开始时间
            if (date.isBefore(startMoment, this.timeSize)) {
                this.queryStore.startMoment = date;
            }
            this.queryStore.endMoment = date;
        }
    }

    componentWillMount() {
        this.onSearch();
        
        runInAction(() => {
            this.filterFields = flattenDeep(this.appStore.selectedConfig.sources).map((filter, key) => ({
                key: key,
                label: filter.label,
                value: filter.field
            }));
        });
    }

    render() {
        return (
            <div>
                <Row type="flex" justify="space-between" align="middle" gutter={24}>
                    <Col span={22}>
                        <input ref={el => this.onInitDateTimeSlider(el)} />
                    </Col>
                    <Col span={2}>
                        <Button size="large" type="primary" onClick={() => this.onSearch()}>搜索</Button>
                    </Col>
                </Row>
                <Form>
                    <FormItem {...formItemLayout} label="日期范围">
                        <DatePicker
                            value={this.queryStore.startMoment}
                            disabledDate={date => this.onDisabledDate(date, 'start')}
                            disabledTime={date => this.onDisabledTime(date, 'start')}
                            onChange={date => this.onDateTimeChange(date, 'start')}
                            allowClear={false}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss" />
                        <span>&nbsp;&nbsp;~&nbsp;&nbsp;</span>
                        <DatePicker
                            value={this.queryStore.endMoment}
                            disabledDate={date => this.onDisabledDate(date, 'end')}
                            disabledTime={date => this.onDisabledTime(date, 'end')}
                            onChange={date => this.onDateTimeChange(date, 'end')}
                            allowClear={false}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss" />
                    </FormItem>
                    <FormItem {...formItemLayout} label="过滤字段">
                        <CheckboxGroup options={this.filterFields} Change={value => this.onFieldChange(value)} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="条件筛选">
                        <Col span={20}>
                            <Select mode="tags" onChange={value => this.onSearch(value)} tokenSeparators={[',', ' ']} />
                        </Col>
                        <Col span={3} offset={1}>
                            <Button type="primary">保存查询条件</Button>
                        </Col>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default SearchPanel;
