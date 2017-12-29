import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import BaseComponent from '../BaseComponent';

const { Item } = AntBreadcrumb;

export default class Breadcrumb extends BaseComponent {

  render() {
    return (
      <AntBreadcrumb className="breadcrumb">
        <Item>Home</Item>
        <Item><a href="#">Application Center</a></Item>
        <Item><a href="#">Application List</a></Item>
        <Item>An Application</Item>
      </AntBreadcrumb>
    );
  }
}
