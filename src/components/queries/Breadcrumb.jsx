import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { Link } from 'react-router-dom'
import BaseComponent from '../BaseComponent';

const { Item } = AntBreadcrumb;

export default class Breadcrumb extends BaseComponent {
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.object)
    };

    render() {
        const { items = [{ name: '首页', props: { to: '/' } }] } = this.props;

        return (
            <AntBreadcrumb className="breadcrumb">
                {items.map((item, key) => (
                    <Item key={key}>
                        <Link {...item.props}>{item.name}</Link>
                    </Item>
                ))}
            </AntBreadcrumb>
        );
    }
}
