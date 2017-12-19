import elasticsearch from 'elasticsearch';
import store from '../stores';

// Elasticsearch客户端实例
export const client = new elasticsearch.Client({
    host: process.env.SEARCH_FRONT_ES_ENDPOINT
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
    search: (query) => {
        return client.search(query).then((result) => {
            store.appStore.queryResult = result;
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
    /**
     * 删除单数据源
     * @param {String} name - 数据源名称
     * @return {Promise}
     */
    deleleSingleDataSource: (name) => {
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
    deleleMultipleDataSource: (name) => {
        return client.delete({
            index: 'query',
            type: 'multiple',
            id: Buffer.from(name).toString('base64')
        }).catch(throwQueryError('deleteMultipleDataSource()'));
    }
};
