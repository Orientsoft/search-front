import React from 'react';
import {
    Form,
    Input,
    Radio,
    Button,
    Slider,
    DatePicker
} from 'antd';
import { action } from 'mobx';
import Component from './Component';

const FormItem = Form.Item;
const { Search } = Input;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: {
        span: 2
    },
    wrapperCol: {
        span: 22
    }
};

const marks = {
    0: '0',
    26: '10',
    37: '12',
    100: {
        style: {
            color: '#f50',
        },
        label: <strong>24</strong>,
    }
};

export default class SearchPanel extends Component {

  // 想要搜索的数据
  data = {}

  render() {
    return (
      <div>
        <Slider marks={marks} step={1} defaultValue={12} />
        <Form>
          <FormItem {...formItemLayout} label="快速选择">
          <RadioGroup onChange={(e) => this.onTimeChange(e.target.value)}>
            <Radio value={60}>1小时</Radio>
            <Radio value={6 * 60}>6小时</Radio>
            <Radio value={24 * 60}>一天</Radio>
            <Radio value={7 * 24 * 60}>一周</Radio>
          </RadioGroup>
          </FormItem>
          <FormItem {...formItemLayout} label="自定义时间">
            <RangePicker showTime={{
              hideDisabledOptions: true
            }} format="YYYY-MM-DD HH:mm:ss" onChange={(date) => this.onDateChange(date)} />
          </FormItem>
          <FormItem {...formItemLayout} label="过滤字段">
            <RadioGroup onChange={(e) => this.onFieldChange(e.target.value)}>
              <Radio value={'TransCode'}>交易码</Radio>
              <Radio value={'UseTime'}>耗时</Radio>
              <Radio value={'TranName'}>交易内容</Radio>
              <Radio value={'TranCode'}>非成功交易</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem {...formItemLayout} label="过滤条件">
            <Search placeholder="Search..." enterButton onSearch={(value) => this.onSearch(value)} />
          </FormItem>
          <FormItem {...formItemLayout} label="查询条件">
            <Button type="primary">保存查询条件</Button>
          </FormItem>
        </Form>
      </div>
    )
  }

  onTimeChange(value) {

  }

  onDateChange(date) {
      this.data.datetime = {
        from: date[0].toJSON(),
        to: date[1].toJSON()
      };
  }

  onFieldChange(field) {
    this.data.field = field;
  }

  onSearch(value) {
    const fieldValue = value;
    const { datetime, field } = this.data;

    this.elastic.search({
      index: 'tpload-*',
      body: {
        aggs: {
          [field]: {
            date_histogram: {
              field: '@TranTime',
              interval: 'day',
              format: "yyyy-MM-dd"
            }
          }
        },
        query: {
          bool: {
            filter: [{
              range: {
                '@TranTime': {
                  from: datetime.from,
                  to: datetime.to
                }
              }
            }, {
              match_phrase: {
                [field]: {
                  query: fieldValue
                }
              }
            }]
          }
        }
      }
    }).then(() => this.appStore.currentAggs.push(field));
  }
}
