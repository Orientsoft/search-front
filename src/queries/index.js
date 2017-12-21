import { action } from 'mobx';
import store from '../stores';
import Query from './Query';
import FullTextQuery from './FullTextQuery';
import BucketAggregation from './BucketAggregation';

export const buildDateRangeQuery = action((options = {}) => {
    // 保存全局日期时间设置
    store.appStore.startDate = options.startDate;
    store.appStore.endDate = options.endDate;
    store.appStore.timeInterval = options.timeInterval;
    // 构造查询语句
    const agg = new BucketAggregation(options.name);
    const query = new FullTextQuery();
    
    return new Query({
        bool: {
            filter: [
                agg.range({
                    [options.name]: {
                        from: options.startDate,
                        to: options.endDate
                    }
                }).toJSON('aggs'),
                query.matchPhrase({
                    [options.name]: {
                        query: options.value
                    }
                }).toJSON('query')
            ]
        }
    }).with({
        index: store.appStore.selectedIndex
    }).toJSON();
});
