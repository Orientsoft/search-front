import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import RequestBody from '../queries/RequestBody';

/**
 * 组件基类
 * 所有的组件都应该继承自这个组件，以便能方便的获取store、elastic实例以及得到查询结果中的数据
 * @class
 */
class BaseComponent extends React.Component {
    // 类型检查
    static contextTypes = {
        store: PropTypes.object.isRequired,
        elastic: PropTypes.object.isRequired
    };

    // 组件自身状态
    // 这个状态只用于保存网络请求得到的数据，因为得到数据后可能需要更新一次组件
    // 如果需要多次更新，应该用定义mobx可观测数据，用于数据共享和更新
    state = {};
    // 需要提交保存的数据
    // 将需要提交的数据集中在一起，便于调试和查看
    /** @namespace */
    postData = {};

    constructor(props) {
        super(props)
        // 用于构造查询语句
        this.requestBody = new RequestBody();
    }

	/**
	 * 对this.props.store的简写
	 * 使用方法：this.store
     * @return {Object}
	 */
    get store() {
        return this.context.store;
    }

	/**
	 * 对this.props.store.appStore的简写，用于获取store中appStore
	 * 使用方法：this.appStore
     * @return {Object}
	 */
    get appStore() {
        return this.context.store.appStore;
    }

	/**
	 * 对this.props.store.queryStore的简写，用于获取store中queryStore
	 * 使用方法：this.queryStore
     * @return {Object}
	 */
    get queryStore() {
        return this.context.store.queryStore;
    }

	/**
	 * 对this.props.store.appStore.es的简写，因为Elasticsearch并不是一个store
	 * 所以从上下文获取，而不是从store中得到，这里的elastic是../services/elastic.js的实例
	 * 而不是elasticsearch.Client的实例
	 * 使用方法：this.elastic
     * @return {Object}
	*/
    get elastic() {
        return this.context.elastic;
    }

	/**
	 * 获取结果中的hits数据
	 * 没有数据则返回空数组
	 * @param {Object} [result] - 查询结果，不传时从appStore.queryResult中获取
	 * @return {Array}
	 */
    getHits(result) {
        const queryResult = result || this.appStore.queryResult;

        return get(queryResult, 'hits.hits', []);
    }

	/**
	 * 获取结果中的buckets数据
	 * 没有数据则返回空数组
	 * @param {String} agg - 聚合名称
	 * @param {Object} [result] - 查询结果，不传时从appStore.queryResult中获取
	 * @return {Array}
	 */
    getBuckets(agg, result) {
        const queryResult = result || this.appStore.queryResult;

        return get(queryResult, ['aggregations', agg, 'buckets'], []);
    }
}

export default BaseComponent;
