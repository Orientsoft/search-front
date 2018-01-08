import elasticsearch from 'elasticsearch';
import store from '../stores';

// Elasticsearch客户端实例
export const client = new elasticsearch.Client({
    host: '192.168.0.21:9900'
});

function throwQueryError(tip) {
    return (err) => {
        // 更新Elasticsearch错误，组件内可以获取这个错误用弹窗进行提示
        store.appStore.queryError = err;
        console.error(`service::elastic::${tip}: `, err.message);
    };
}

/**
 * 对Elasticsearch方法的封装
 * 根据业务场景隐藏额外的查询细节
 */
export default {
    /**
     * 通用搜索
     * 包括搜索字段、聚合、高亮等等
     * @param {Object} query
     * @return {Promise}
     */
    search: (query, shouldSaveResult = true) => {
        return client.search(query).then((result) => {
            if (shouldSaveResult) {
                store.appStore.queryResult = result;
            }
            return result;
        }).catch(throwQueryError('search()'));
    },
    /**
     * 列出单个或全部index
     * @param {String} index
     * @return {Promise}
     */
    catIndices: (index) => {
        return client.cat.indices({
            index,
            // 不显示列头
            v: false,
            // 返回JSON格式数据
            format: 'json'
        }).catch(throwQueryError('catIndices()'));
    },
    /**
     * 列出指定index的信息
     * @param {String} index
     * @return {Promise}
     */
    getIndices: (index) => {
        return client.indices.get({
            index,
            // 忽略无效index
            ignoreUnavailable: true
        }).catch(throwQueryError('getIndices()'));
    },
    /**
     * 保存单数据源
     * @param {String} name - 数据源名称
     * @param {Object} data - 数据
     * @return {Promise}
     */
    saveSingleDataSource: (name, data) => {
        return client.create({
            index: 'query',
            type: 'single',
            id: Buffer.from(name).toString('base64'),
            body: data
        }).catch(throwQueryError('saveSingleDataSource()'));
    },
    getSingleDataSource: (name) => {
        let query = {
            index: 'query',
            type: 'single'
        };

        if (name) {
            query = Object.assign(query, {
                id: Buffer.from(name).toString('base64')
            });
        }

        return client.search(query).catch(throwQueryError('search()'));
    },
    /**
     * 删除单数据源
     * @param {String} name - 数据源名称
     * @return {Promise}
     */
    deleteSingleDataSource: (name) => {
        return client.delete({
            index: 'query',
            type: 'single',
            id: Buffer.from(name).toString('base64')
        }).catch(throwQueryError('deleteSingleDataSource()'));
    },
    /**
     * 保存联合查询
     * @param {String} name - 数据源名称
     * @param {Object} data - 数据
     * @return {Promise}
     */
    saveMultipleDataSource: (name, data) => {
        return client.create({
            index: 'query',
            type: 'multiple',
            id: Buffer.from(name).toString('base64'),
            body: data
        }).catch(throwQueryError('saveMultipleDataSource()'));
    },
    /**
     * 删除联合查询
     * @param {String} name - 数据源名称
     * @return {Promise}
     */
    deleteMultipleDataSource: (name) => {
        return client.delete({
            index: 'query',
            type: 'multiple',
            id: Buffer.from(name).toString('base64')
        }).catch(throwQueryError('deleteMultipleDataSource()'));
    },
    /** 获取多数据源数据 */
    getMultipleDataSource: (name) => {
        let query = {
            index: 'query',
            type: 'multiple'
        };

        if (name) {
            query = Object.assign(query, {
                id: Buffer.from(name).toString('base64')
            });
        }

        return client.search(query).catch(throwQueryError('search()'));
    },
    // 保存指标配置
    saveMetricDataSource: (name, data) => {
        return client.create({
            index: 'query',
            type: 'metric',
            id: Buffer.from(name).toString('base64'),
            body: data
        }).catch(throwQueryError('saveMetricDataSource()'));
    },
    // 获取指标配置
    getMetricDataSource: (name) => {
        let query = {
            index: 'query',
            type: 'metric'
        };

        if (name) {
            query = Object.assign(query, {
                id: Buffer.from(name).toString('base64')
            });
        }

        return client.search(query).catch(throwQueryError('search()'));
    },
    // 删除指标配置
    deleteMetricDataSource: (name) => {
        return client.delete({
            index: 'query',
            type: 'metric',
            id: Buffer.from(name).toString('base64')
        }).catch(throwQueryError('deleteMetricDataSource()'));
    },
    // 修改指标
    updateMetricDataSource: (name, data) => {
        return client.update({
            index: 'query',
            type: 'metric',
            id: Buffer.from(name).toString('base64'),
            body: {
                doc: data
            }
        }).catch(throwQueryError('updateMetricDataSource()'));
    },


    // 修改单数据源
    updateSingleDataSource: (name, data) => {
        return client.update({
            index: 'query',
            type: 'single',
            id: Buffer.from(name).toString('base64'),
            body: {
                doc: data
            }
        }).catch(throwQueryError('updateSingleDataSource()'));
    },
    // 修改多数据源
    updateMultipleDataSource: (name, data) => {
        return client.update({
            index: 'query',
            type: 'multiple',
            id: Buffer.from(name).toString('base64'),
            body: {
                doc: data
            }
        }).catch(throwQueryError('updateMultipleDataSource()'));
    },

    // 获取拓扑配置
    getNodes: (name) => {
        let query = {
            index: 'query',
            type: 'nodes'
        };

        if (name) {
            query = Object.assign(query, {
                id: Buffer.from(name).toString('base64')
            });
        }

        return client.search(query).catch(throwQueryError('getNodes()'));
    },
    saveNode: (name, data) => {
        return client.create({
            index: 'query',
            type: 'nodes',
            id: Buffer.from(name).toString('base64'),
            body: data
        }).catch(throwQueryError('saveNode()'));
    },
    updateNode: (name, data) => {
        return client.update({
            index: 'query',
            type: 'nodes',
            id: Buffer.from(name).toString('base64'),
            body: {
                doc: data
            }
        }).catch(throwQueryError('updateNode()'));
    },
    deleteNode: (name) => {
        return client.delete({
            index: 'query',
            type: 'nodes',
            id: Buffer.from(name).toString('base64')
        }).catch(throwQueryError('deleteNode()'));
    }
};
