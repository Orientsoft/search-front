import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

/**
 * 组件基类
 * 所有的组件都应该继承自这个组件，以便能方便的获取store、elastic实例以及得到查询结果中的数据，
 * 而不是每次在props中取this.props.store.appStore.query()这种繁琐写法
 */
class Component extends React.Component {

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
	 */
    getHits() {
        return get(this.appStore.queryResult, 'hits.hits', []);
    }

	/**
	 * 获取结果中的buckets数据
	 * 没有数据则返回空数组
	 */
    getBuckets(agg) {
        return get(this.appStore.queryResult, `aggregations.${agg}.buckets`, []);
    }
}

export default Component;
