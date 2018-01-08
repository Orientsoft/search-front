import * as mobx from 'mobx';
import merge from 'lodash/merge';

/**
 * 对Elasticsearch查询对象的封装
 * 所有查询类的基类
 */
class Query {
    /**
     * 合并多个查询
     * @param {Array} [otherQueries] - 多个Query类的实例或者普通JS对象
     * @return {Object} 多个查询合并后的新查询对象
     */
    static merge(...otherQueries) {
        return otherQueries.reduce((queries, otherQuery) => {
            // 如果是Query类或者其子类，通过toJSON()方法得到普通对象形式
            // 如果不是Query类，交给merge方法决定如何合并
            const query = otherQuery instanceof Query ? otherQuery.toJSON() : otherQuery;
            // 返回合并后的普通对象
            return merge(queries, query);
        }, {});
    }

    /**
     * 构造一个新查询对象
     * @param {Object} [initialQuery] - 初始查询条件
     */
    constructor(initialQuery = {}) {
        this.body = mobx.observable(initialQuery);
    }

    /**
     * 得到查询的普通对象形式
     */
    toJSON() {
        return mobx.toJS(this.body);
    }
}

/**
 * 辅助函数
 * 用于方便定义各种查询
 * @param {String} name - 查询名称
 * @return {Function} 查询构造函数
 */
export function defineQuery(name) {
    return (initialQuery = {}) => new Query({ [name]: initialQuery });
}

export default Query;
