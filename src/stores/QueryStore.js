import { observable, extendObservable } from 'mobx';
import * as moment from 'moment';
import RequestBody from '../queries/RequestBody';
import { terms as termsQuery } from '../queries/core/TermQuery';
import { dateHistogram, terms as termsAgg } from '../queries/core/BucketAggregation';

/**
 * 保存查询条件的Store
 * 只定义需要共享的查询参数，不需要作为查询参数的应该在AppStore里定义
 */
export class QueryStore {
    metadata = {};

    constructor() {
        extendObservable(this, {
            // 当前激活索引
            index: ['mobile-weblogic-jvm-*'],
            // 过滤字段
            filterFields: [{
                field: 'message.msg.ThreadActiveCount',
                value: 5
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
        const filterField = this.filterFields[0];
        const body = new RequestBody().add(termsQuery({
            [filterField.field]: [].concat(filterField.value)
        }));

        return body.add(termsAgg(filterField.field, {
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
    }

    buildPagination(from = 0) {
        const filterField = this.filterFields[0];
        
        return new RequestBody().from(from).add(termsQuery({
            [filterField.field]: [].concat(filterField.value)
        }));
    }
}

export default new QueryStore();
