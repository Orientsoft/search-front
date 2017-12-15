import React from 'react';
import Breadcrumb from './Breadcrumb';
import OperationPanel from './OperationPanel';
import TabContent from './TabContent';
import styles from '../less/styles.less';

export default () => (
    <div className={styles.workspace}>
        <Breadcrumb />
        <OperationPanel />
        <TabContent />
    </div>
);
