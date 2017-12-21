import { action } from 'mobx';
import store from '../stores';
import Query from './Query';
import FullTextQuery from './FullTextQuery';
import BucketAggregation from './BucketAggregation';

export const buildDateRangeQuery = action((field, value) => {
    // 构造查询语句
    const agg = new BucketAggregation(field);
    const query = new FullTextQuery();
    
    return new Query({
        bool: {
            filter: [
                agg.range({
                    [field]: {
                        from: store.appStore.startDate,
                        to: store.appStore.endDate
                    }
                }).toJSON('aggs'),
                query.matchPhrase({
                    [field]: {
                        query: value
                    }
                }).toJSON('query')
            ]
        }
    }).with({
        index: store.appStore.selectedIndex
    }).toJSON();
});
