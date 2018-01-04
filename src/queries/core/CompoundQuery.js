import { defineQuery } from './Query';

/**
 * 复合查询封装
 * 使用方法：
 *   this.elastic.search({
 *     query: bool({ must: { term: { status: 'NA' } } }).toJSON())
 *   });
 */
export const bool = defineQuery('bool');
