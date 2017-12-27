import { defineQuery } from './Query';

/**
 * 词条查询封装
 * 使用方法：
 *   this.elastic.search({
 *     query: term({ status: 'NA' }).toJSON())
 *   });
 */
export const term = defineQuery('term');
export const terms = defineQuery('terms');
