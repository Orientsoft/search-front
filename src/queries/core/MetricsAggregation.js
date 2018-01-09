import { defineAggregation } from './Aggregation';

/**
 * 指标聚合封装
 * 使用方法：
 *   this.elastic.search({
 *     aggs: sum('TranCount', { field: 'TranCount' }).toJSON()
 *   });
 */
export const avg = defineAggregation('avg');
export const max = defineAggregation('max');
export const min = defineAggregation('min');
export const sum = defineAggregation('sum');
export const valueCount = defineAggregation('value_count');
