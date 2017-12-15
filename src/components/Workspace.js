import React from 'react';
import Breadcrumb from './Breadcrumb';
import OperationPanel from './OperationPanel';
import styles from '../less/workspace.less';

export default () => (
    <div className={styles.workspace}>
        <Breadcrumb />
        <OperationPanel />
    </div>
);
