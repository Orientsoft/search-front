import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import get from 'lodash/get';

/**
 * 组件基类
 * 所有的组件都应该继承自这个组件，以便能方便的获取store、elastic实例以及得到查询结果中的数据
 */
@observer class Component extends React.Component {

    static contextTypes = {
        store: PropTypes.object.isRequired,
        elastic: PropTypes.object.isRequired
    };

	/**
	 * 对this.props.store的简写
	 * 使用方法：this.store
	 */
    get store() {
        return this.context.store;
    }

	/**
	 * 对this.props.store.appStore的简写，用于获取store中appStore
	 * 使用方法：this.appStore
	 */
    get appStore() {
        return this.context.store.appStore;
	}
	
	/**
	 * 对this.props.store.queryStore的简写，用于获取store中queryStore
	 * 使用方法：this.queryStore
	 */
	get queryStore() {
		return this.context.store.queryStore;
	}

	/**
	 * 对this.props.store.appStore.es的简写，因为Elasticsearch并不是一个store
	 * 所以从上下文获取，而不是从store中得到，这里的elastic是../services/elastic.js的实例
	 * 而不是elasticsearch.Client的实例
	 * 使用方法：this.elastic
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

        return get(queryResult, `aggregations.${agg}.buckets`, []);
    }
}

export default Component;
