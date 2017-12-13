import React from 'react';
import {observer} from 'mobx-react';
import { Layout, Input, Select, Button, Row, Col } from 'antd';
import { logo } from '../less/style.less';

const { Header, Content, Footer } = Layout;
const Option = Select.Option;
const { TextArea } = Input;

@observer class App extends React.Component {
    constructor() {
        super();

        this.render = this.render.bind(this);
    }

    render() {
        const updateQueryString = (e) => {
            this.props.store.appStore.updateQueryString(e.target.value);
        };

        const query = () => {
            this.props.store.appStore.query();
        };

        return <div>
            <Layout>
                <Header><div className={logo} /></Header>
                <Content>
                    <Row>
                        <Col span={1}>query:</Col>
                        <Col span={23}><TextArea rows={16} defaultValue="{ }" onChange={updateQueryString} /></Col>
                    </Row>
                    <Row>
                        <Col span={1} offset={1}><Button shape="circle" icon="search" onClick={query} /></Col>
                    </Row>
                    <Row>
                        <Col span={1}>result:</Col>
                        <Col span={23}><TextArea rows={16} value={this.props.store.appStore.resultString} /></Col>
                    </Row>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Search-Front ©2017 Created by Orientsoft
                </Footer>
            </Layout>
        </div>;
    }
}

export default App;
