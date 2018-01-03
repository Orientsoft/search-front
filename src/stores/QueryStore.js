import { observable, extendObservable } from 'mobx';
import * as moment from 'moment';
import RequestBody from '../queries/RequestBody';
import { terms } from '../queries/core/TermQuery';
import { dateHistogram, terms as termsAgg } from '../queries/core/BucketAggregation';

/**
 * 保存查询条件的Store
 * 只定义需要共享的查询参数，不需要作为查询参数的应该在AppStore里定义
 */
export class QueryStore {
    constructor() {
        extendObservable(this, {
            // 当前激活索引
            index: [],
            // 过滤字段
            filterFields: ['message.msg.ThreadActiveCount'],
            // 日期格式
            momentFormat: 'YYYY-MM-DD HH:mm:ss',
            // 开始日期
            startMoment: observable.ref(moment().startOf('day')),
            // 结束日期
            endMoment: observable.ref(moment())
        });
    }

    buildSearchBody(field, value) {
        const searchBody = new RequestBody().add(terms({
            [field]: [].concat(value)
        }));

        return this.filterFields.reduce((body, filterField) => body.add(termsAgg(filterField, {
            field: filterField
        }).with(dateHistogram('@timestamp', {
            field: '@timestamp',
            format: 'yyyy-MM-dd',
            interval: 'day',
            min_doc_count: 0,
            extended_bounds: {
                min: this.startMoment.format('YYYY-MM-DD'),
                max: this.endMoment.format('YYYY-MM-DD')
            }
        }))), searchBody);
    }
}

export default new QueryStore();
