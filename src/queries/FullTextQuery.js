import Query from './Query';

/**
 * 全文查询封装
 * 使用方法：
 *   const query = new FullTextQuery();
 *   // 执行搜索
 *   this.elastic.search(query.matchPhrase({ status: 'NA' }).toJSON());
 */
class FullTextQuery extends Query {
    match(query) {
        return this.with(new Query({ match: query }));
    }

    matchPhrase(query) {
        return this.with(new Query({ match_phrase: query }));
    }

    matchPhrasePrefix(query) {
        return this.with(new Query({ match_phrase_prefix: query }));
    }

    multiMatch(query) {
        return this.with(new Query({ multi_match: query }));
    }

    commonTerms(query) {
        return this.with(new Query({ common: query }));
    }

    queryString(query) {
        return this.with(new Query({ query_string: query }));
    }

    simpleQueryString(query) {
        return this.with(new Query({ simple_query_string: query }));
    }
}

export default FullTextQuery;
