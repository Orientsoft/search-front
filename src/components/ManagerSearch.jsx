import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import cloneDeep from 'lodash/cloneDeep';
import {Row, Col,Input,Button,Icon,Select,Card } from 'antd';

const Option = Select.Option;


@observer class ManagerSearch extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.store = this.props.store.appStore;
        this.state = {
            indexValue:'',
            typeValue: '',
            name:'',
            keys:[],
            source:[]
        }
    }
    componentDidMount (){
        this.store.showAllIndexs()
        this.store.query(JSON.stringify({index: 'query',type: 'history'})).then( (result)=>{
            this.setState({
                source:result.hits.hits
            })

        })

    }

    indexChange(value) {
        this.store.showAllTypes(value);
        this.setState({
            indexValue: value
        })
        console.log("type",this.store.state.typeOptions)
    }
    typeChange(value) {
        this.setState({
            typeValue: value
        })
        this.store.typeChange(value)
    }

    keysChange (value){
        this.setState({
            keys: value
        })
    }

    nameChange(e){
        this.setState({
            name: e.target.value
        })
    }

    saveSource(e){
        var json = {
            index:this.state.indexValue,
            type:this.state.typeValue,
            keys:this.state.keys,
            name:this.state.name
        }
        this.store.getQueries(this.state.name,json)
        this.state.source.push({
            _index: '',
            _type: '',
            _source: json
        }) 
        this.forceUpdate()
    }
    delSource(e,name,key){
        console.log(name)
        this.store.delQueries(name)
        this.state.source.splice(key,1)
        this.forceUpdate()
    }
   
    render() {
        return (
            <Card>
            <p className = 'headerManager'>定义单数据源：</p>
            <Button type="primary" icon="plus">添加数据</Button>
            <div className = 'contentManager'>
                <Row gutter={16}>
                    <Col span={3} className="gutter-row">数据源:</Col>
                    <Col span={3} className="gutter-row">数据类型:</Col>
                    <Col span={9} className="gutter-row">多字段选择:</Col>
                    <Col span={5} className="gutter-row">名称:</Col>
                </Row>
                <Row gutter={16}>
                    <Col span={3} className="gutter-row">
                        <Select  style={{ width: '100%' }} onChange={(value) => this.indexChange(value)}>
                            {this.store.state.indexOptions && this.store.state.indexOptions.map( (item)=>{
                                return <Option value={item.index} key = {item.index}>{item.index}</Option>
                            })}
                        </Select>
                    </Col>
                    <Col span={3} className="gutter-row">
                        <Select  style={{ width: '100%' }} onChange={(value) => this.typeChange(value)}>
                            {this.store.state.typeOptions && this.store.state.typeOptions.map( (item)=>{
                                return <Option value={item} key = {item}>{item}</Option>
                            })}
                        </Select>
                    </Col>
                    <Col span={9} className="gutter-row">
                        <Select
                            mode="tags"
                            placeholder="Please select"
                            defaultValue={[]}
                            style={{ width: '100%' }}
                            onChange={(value) => this.keysChange(value)}
                        >
                            {this.store.state.results && this.store.state.results.map( (item)=>{
                                return <Option value={item.name} key = {item.name}>{item.name}</Option>
                            })}
                        </Select>
                    </Col>
                    <Col span={5} className="gutter-row">
                        <Input onChange={(value) => this.nameChange(value)}/> 
                    </Col>
                    <Col span={4} className="gutter-row">
                        <Button type="primary" onClick={(e) => this.saveSource(e)}>保存</Button>
                    </Col>
                </Row>
            </div> 
             <div className = 'contentManager'>
                {this.state.source && this.state.source.map( (item, key) => {
                return( <Row gutter={16}>
                        <Col span={3} className="gutter-row">
                            <Select defaultValue={item._source.index} style={{ width: '100%' }}>
                            {this.store.state.indexOptions && this.store.state.indexOptions.map( (item)=>{
                                return <Option value={item.index} key = {item.index}>{item.index}</Option>
                            })}
                            </Select>
                        </Col>
                        <Col span={3} className="gutter-row">
                            <Select defaultValue={item._source.type} style={{ width: '100%' }}>
                            {this.store.state.typeOptions && this.store.state.typeOptions.map( (item)=>{
                                return <Option value={item} key = {item}>{item}</Option>
                            })}
                            </Select>
                        </Col>
                        <Col span={9} className="gutter-row">
                            <Select
                                mode="tags"
                                placeholder="Please select"
                                defaultValue={item._source.keys}
                                style={{ width: '100%' }}
                            >
                                {this.store.state.results && this.store.state.results.map( (item)=>{
                                    return <Option value={item.name} key = {item.name}>{item.name}</Option>
                                })}
                            </Select>
                        </Col>
                        <Col span={5} className="gutter-row">
                            <Input defaultValue = {item._source.name}/> 
                        </Col>
                        <Col span={4} className="gutter-row">
                            <Button onClick={(e) => this.delSource(e, item._source.name,key)} >编辑</Button>
                            <Button  onClick={(e) => this.delSource(e,item._source.name,key)}>删除</Button>
                        </Col>
                    </Row> )
                })}
                
            </div>
            </Card>
        )
    }
}

export default ManagerSearch
