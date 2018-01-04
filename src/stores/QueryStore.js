import { observable, extendObservable } from 'mobx';
import * as moment from 'moment';
import RequestBody from '../queries/RequestBody';
import { terms as termsQuery } from '../queries/core/TermQuery';
import { bool as boolQuery } from '../queries/core/CompoundQuery';
import { dateHistogram, terms as termsAgg } from '../queries/core/BucketAggregation';

/**
 * 保存查询条件的Store
 * 只定义需要共享的查询参数，不需要作为查询参数的应该在AppStore里定义
 */
export class QueryStore {
    constructor() {
        extendObservable(this, {
            // 当前激活索引
            index: ['mobile-weblogic-jvm-*'],
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
            should: []
        });

        this.filterFields.forEach((filterField) => {
            query.body.bool.should.push(termsQuery({
                [filterField.field]: [].concat(filterField.value)
            }).toJSON());
            body.add(termsAgg(filterField.field, {
                field: filterField.field
            }).with(dateHistogram('@timestamp', {
                field: '@timestamp',
                format: 'yyyy-MM-dd',
                interval: 'day',
                min_doc_count: 0,
                extended_bounds: {
                    min: this.startMoment.format('YYYY-MM-DD'),
                    max: this.endMoment.format('YYYY-MM-DD')
                }
            })));
        });

        return body.add(query);
    }

    buildPagination(from = 0) {
        const body = new RequestBody().size(this.size).from(from);
        const query = boolQuery({
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
