import { observable, extendObservable } from 'mobx';
import * as moment from 'moment';
import RequestBody from '../queries/RequestBody';
import { terms as termsQuery, range as rangeQuery } from '../queries/core/TermQuery';
import { bool as boolQuery } from '../queries/core/CompoundQuery';
import { dateHistogram } from '../queries/core/BucketAggregation';
import { sum as sumAgg } from '../queries/core/MetricsAggregation';

/**
 * 保存查询条件的Store
 * 只定义需要共享的查询参数，不需要作为查询参数的应该在AppStore里定义
 */
export class QueryStore {
    constructor() {
        extendObservable(this, {
            // 当前激活索引
            index: [],
            size: 101,
            // 过滤字段
            filterFields: [{
                field: 'message.msg.ThreadActiveCount',
                value: 5
            }, {
                field: 'message.msg.Uptime',
                value: 4314326
            }],
            // 日期格式
            momentFormat: 'YYYY-MM-DD HH:mm:ss',
            // 开始日期
            startMoment: observable.ref(moment().startOf('day')),
            // 结束日期
            endMoment: observable.ref(moment())
        });
    }

    buildSearch() {
        const body = new RequestBody().size(this.size);
        const query = boolQuery({
            must: [rangeQuery({
                '@timestamp': {
                    gte: this.startMoment.format('YYYY-MM-DD'),
                    lte: this.endMoment.format('YYYY-MM-DD'),
                    time_zone: '+08:00'
                }
            }).toJSON()],
            should: []
        });

        this.filterFields.forEach((filterField) => {
            query.body.bool.should.push(termsQuery({
                [filterField.field]: [].concat(filterField.value)
            }).toJSON());
            body.add(dateHistogram('@timestamp', {
                field: '@timestamp',
                format: 'yyyy-MM-dd',
                interval: 'day',
                time_zone: '+08:00',
                min_doc_count: 0,
                extended_bounds: {
                    min: this.startMoment.format('YYYY-MM-DD'),
                    max: this.endMoment.format('YYYY-MM-DD')
                }
            }).with(sumAgg(filterField.field, {
                field: filterField.field
            })));
        });

        return body.add(query);
    }

    buildPagination(from = 0) {
        const body = new RequestBody().size(this.size).from(from);
        const query = boolQuery({
            must: [rangeQuery({
                '@timestamp': {
                    gte: this.startMoment.format('YYYY-MM-DD'),
                    lte: this.endMoment.format('YYYY-MM-DD'),
                    time_zone: '+08:00'
                }
            }).toJSON()],
            should: []
        });

        this.filterFields.forEach((filterField) => {
            query.body.bool.should.push(termsQuery({
                [filterField.field]: [].concat(filterField.value)
            }).toJSON());
        });

        return body.add(query);
    }
}

export default new QueryStore();
