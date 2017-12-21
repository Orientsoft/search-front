import { observable } from 'mobx';
import * as moment from 'moment';

/**
 * 保存查询条件的Store
 * 只定义需要共享的查询参数，不需要作为查询参数的应该在AppStore里定义
 */
export default class QueryStore {
    // 日期格式
    @observable.ref momentFormat = 'YYYY-MM-DD hh:mm';
    // 开始日期
    @observable.ref startMoment = moment().startOf('day');
    // 结束日期
    @observable.ref endMoment = moment();
}
