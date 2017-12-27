import { observable, extendObservable } from 'mobx';
import * as moment from 'moment';

/**
 * 保存查询条件的Store
 * 只定义需要共享的查询参数，不需要作为查询参数的应该在AppStore里定义
 */
export class QueryStore {
    constructor() {
        extendObservable(this, {
            // 当前激活索引
            index: [],
            // 日期格式
            momentFormat: 'YYYY-MM-DD HH:mm:ss',
            // 开始日期
            startMoment: observable.ref(moment().startOf('day')),
            // 结束日期
            endMoment: observable.ref(moment())
        });
    }
}

export default new QueryStore();
