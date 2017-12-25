import { defineQuery } from './Query';

/**
 * 全文查询封装
 * 使用方法：
 *   this.elastic.search({
 *     query: matchPhrase({ status: 'NA' }).toJSON())
 *   });
 */
export const match = defineQuery('match');
export const matchPhrase = defineQuery('match_phrase');
