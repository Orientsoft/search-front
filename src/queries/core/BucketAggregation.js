import { defineAggregation } from './Aggregation';

/**
 * 桶聚合封装
 * 使用方法：
 *   this.elastic.search({
 *     aggs: terms({ field: 'TranName' }).toJSON()
 *   });
 */
export const dateHistogram = defineAggregation('date_history');
export const dateRange = defineAggregation('date_range');
export const filter = defineAggregation('filter');
export const filters = defineAggregation('filters');
export const ipRange = defineAggregation('ip_range');
export const range = defineAggregation('range');
export const terms = defineAggregation('terms');
