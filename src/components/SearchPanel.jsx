import React from 'react';
import {
    Form,
    Input,
    Radio,
    Button,
    Slider,
    DatePicker
} from 'antd';

const FormItem = Form.Item;
const { Search } = Input;
const { RangePicker } = DatePicker;

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

export default class SearchPanel extends React.Component {

  render() {
    return (
      <div>
        <Slider marks={marks} step={1} defaultValue={12} />
        <Form>
          <FormItem {...formItemLayout} label="快速选择">
            <Radio>1小时</Radio>
            <Radio>6小时</Radio>
            <Radio>一天</Radio>
            <Radio>一周</Radio>
          </FormItem>
          <FormItem {...formItemLayout} label="自定义时间">
            <RangePicker />
          </FormItem>
          <FormItem {...formItemLayout} label="过滤字段">
            <Radio>交易码</Radio>
            <Radio>耗时</Radio>
            <Radio>交易内容</Radio>
            <Radio>非成功交易</Radio>
          </FormItem>
          <FormItem {...formItemLayout} label="过滤条件">
            <Search placeholder="Search..." enterButton />
          </FormItem>
          <FormItem {...formItemLayout} label="查询条件">
            <Button type="primary">保存查询条件</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
