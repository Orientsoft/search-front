import * as mobx from 'mobx';
import queryStore from '../stores/QueryStore';
import Query from './core/Query';
import Aggregation from './core/Aggregation';
import merge from 'lodash/merge';
import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';

/**
 * Elasticsearch查询JSON封装
 * @class
 */
class RequestBody {
    // 保存通过方法调用(例如：add())添加的查询对象，可以是任何值
    @mobx.observable queries = [];
    
    constructor(initialBody) {
        // 保存只通过方法调用修改而不添加的查询对象，例如index、type、from等等
        this.body = mobx.observable(isPlainObject(initialBody) ? initialBody : {
            index: queryStore.index.toString(),
            body: {}
        });
    }

    /**
     * 对JS原始值进行装箱，以便能追踪变量改动
     * @private
     * @param {String} key - 字段名
     * @param {String|Number} value - 字段值
     * @return {RequestBody}
     */
    __box(key, value) {
        if (this.body.body.hasOwnProperty(key)) {
            this.body.body[key].set(value);
        } else {
            // 原始值的改动并不会直接被mobx追踪到，此处需要利用observable.box()方法进行装箱
            this.body.body[key] = mobx.observable.box(value);
        }
        // 返回自身，以便可以进行链式调用
        return this;
    }

    /**
     * 设置查询所在的索引
     * @param {String} value - 索引
     * @return {RequestBody}
     */
    index(value) {
        this.body.index = value;

        return this;
    }

    /**
     * 设置查询所在的类型
     * @param {String} value - 类型
     * @return {RequestBody}
     */
    type(value) {
        this.body.type = value;

        return this;
    }

    /**
     * 设置分页开始的位置
     * @param {Number} value - 分页开始索引
     * @return {RequestBody}
     */
    from(value) {
        return this.__box('from', value);
    }

    /**
     * 设置分页大小
     * @param {Number} value - 分页大小
     * @return {RequestBody}
     */
    size(value) {
        return this.__box('size', value);
    }

    /**
     * 设置需要高亮返回的字段
     * @param {Array} fields - 需要高亮的字段集合
     * @param {Object} [options] - 配置选项
     * @return {RequestBody}
     */
    highlight(fields, options = {}) {
        if (!this.body.body.hasOwnProperty('highlight')) {
            this.body.body.highlight = {
                fields: {}
            };
        }
        {
            const { fields, ...others } = options;
            merge(this.body.body.highlight, {...others});
        }
        fields.forEach(field => {
            if (isString(field)) {
                this.body.body.highlight.fields[field] = {};
            } else if (isPlainObject(field)) {
                merge(this.body.body.highlight.fields, field);
            }
        });

        return this;
    }

    /**
     * 添加查询
     * 比如添加Query、Aggregation或普通JS对象
     * @param {Object} queryOrAgg - 查询条件
     * @return {RequestBody}
     */
    add(queryOrAgg) {
        // 防止重复添加
        if (this.queries.indexOf(queryOrAgg) === -1) {
            this.queries.push(queryOrAgg);
        }

        return this;
    }

    /**
     * 得到查询JSON，可以直接用于elastic.search()等方法
     */
    toJSON() {
        return merge(mobx.toJS(this.body), {
            body: this.queries.reduce((body, query) => {
                if (query instanceof Query) {
                    return merge(body, { query: query.toJSON() });
                } else if (query instanceof Aggregation) {
                    return merge(body, { aggs: query.toJSON() });
                } else if (query instanceof RequestBody) {
                    return merge(body, query.toJSON().body);
                }

                return merge(body, query);
            }, mobx.toJS(this.body.body))
        });
    }
}

export default RequestBody;
