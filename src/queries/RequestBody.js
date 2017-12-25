import mobx, { observable } from 'mobx';
import Query from './core/Query';
import Aggregation from './core/Aggregation';
import merge from 'lodash/merge';

/**
 * Elasticsearch查询JSON封装
 */
class RequestBody {
    // 保存通过方法调用(例如：add())添加的查询对象，可以是任何值
    @observable queries = [];
    // 保存只通过方法调用修改而不添加的查询对象，例如index、type、from等等
    @observable body = {};

    /**
     * 对JS原始值进行装箱，以便能追踪变量改动
     * @param {String} key - 字段名
     * @param {String|Number} value - 字段值
     * @return {RequestBody}
     */
    __box(key, value) {
        if (this.body.hasOwnProperty(key)) {
            this.body[key].set(value);
        } else {
            // 原始值的改动并不会直接被mobx追踪到，此处需要利用observable.box()方法进行装箱
            this.body[key] = observable.box(value);
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
        return this.__box('index', value);
    }

    /**
     * 设置查询所在的类型
     * @param {String} value - 类型
     * @return {RequestBody}
     */
    type(value) {
        return this.__box('type', value);
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
     * 设置分页结束的位置
     * @param {Number} value - 分页结束索引
     * @return {RequestBody}
     */
    to(value) {
        return this.__box('to', value);
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
        return merge(mobx.toJS(this.body), this.queries.reduce((body, query) => {
            if (query instanceof Query) {
                return merge(body, { query: query.toJSON() });
            } else if (query instanceof Aggregation) {
                return merge(body, { aggs: query.toJSON() });
            }

            return merge(body, query);
        }, {}));
    }
}

export default RequestBody;
