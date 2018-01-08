import * as mobx from 'mobx';
import merge from 'lodash/merge';

/**
 * 对Elasticsearch聚合对象的封装
 * 所有聚合类的基类
 */
class Aggregation {
    /**
     * 合并多个聚合
     * @param {Array} [otherAggs] - 多个Aggregation类的实例或者普通JS对象
     * @return {Object} 多个聚合合并后的新查询对象
     */
    static merge(...otherAggs) {
        return otherAggs.reduce((aggs, otherAgg) => {
            // 如果是Aggregation类或者其子类，通过toJSON()方法得到普通对象形式
            // 如果不是Aggregation类，交给merge方法决定如何合并
            const agg = otherAgg instanceof Aggregation ? otherAgg.toJSON() : otherAgg;
            // 返回合并后的普通对象
            return merge(aggs, agg);
        }, {});
    }

    /**
     * 构造一个新聚合对象
     * @param {String} name - 聚合名称
     * @param {Object} [initialAgg] - 初始聚合条件
     */
    constructor(name, initialAgg = {}) {
        this.name = name;
        this.body = mobx.observable(initialAgg);
    }

    /**
     * 将多个聚合合并为当前聚合的子聚合
     * @param {Array} [otherAggs] - 多个Aggregation类的实例或者普通JS对象
     * @return {Aggregation} 一个新的Aggregation实例
     */
    with(...otherAggs) {
        return new Aggregation(this.name, merge(mobx.toJS(this.body), {
            aggs: Aggregation.merge(...otherAggs)
        }));
    }

    /**
     * 得到聚合的普通对象形式
     */
    toJSON() {
        return {
            [this.name]: mobx.toJS(this.body)
        };
    }
}

/**
 * 辅助函数
 * 用于方便定义各种聚合
 * @param {String} name - 聚合名称
 * @return {Function} 聚合构造函数
 */
export function defineAggregation(agg) {
    return (name, initialAgg) => new Aggregation(name, {
        [agg]: initialAgg
    });
}

export default Aggregation;
