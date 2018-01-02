import React from 'react';
import Breadcrumb from './Breadcrumb';
import OperationPanel from './OperationPanel';
import TabContent from './TabContent';

export default () => (
    <div className="workspace">
        <Breadcrumb />
        <OperationPanel />
        <TabContent />
    </div>
);
