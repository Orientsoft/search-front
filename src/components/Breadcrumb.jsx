import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import styles from '../less/styles.less';

const Item = AntBreadcrumb.Item;

export default class Breadcrumb extends React.Component {

  render() {
    return (
      <AntBreadcrumb className={styles.breadcrumb}>
        <Item>Home</Item>
        <Item><a href="#">Application Center</a></Item>
        <Item><a href="#">Application List</a></Item>
        <Item>An Application</Item>
      </AntBreadcrumb>
    );
  }
}
