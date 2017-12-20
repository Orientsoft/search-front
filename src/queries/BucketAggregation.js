import Aggregation from './Aggregation';

/**
 * 桶查询封装
 * 使用方法：
 *   const agg = new BucketAggregation('transation');
 *   // 执行搜索
 *   this.elastic.search(agg.terms({ field: 'TranName' }).toJSON());
 */
class BucketAggregation extends Aggregation {
    dateHistogram(query) {
        return this.with(new Aggregation('date_histogram', query));
    }

    dateRange(query) {
        return this.with(new Aggregation('date_range', query));
    }

    filter(query) {
        return this.with(new Aggregation('filter', query));
    }

    filters(query) {
        return this.with(new Aggregation('filters', query));
    }

    ipRange(query) {
        return this.with(new Aggregation('ip_range', query));
    }

    range(query) {
        return this.with(new Aggregation('range', query));
    }

    terms(query) {
        return this.with(new Aggregation('terms', query));
    }
}

export default BucketAggregation;
