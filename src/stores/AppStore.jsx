import { observable, extendObservable } from 'mobx';

/**
 * 应用级Store
 * 保存全局数据、状态及方法
 */
export default class AppStore {
    constructor(others) {
        extendObservable(this, Object.assign({
            queryResult: observable.ref({}),
            queryError: observable.ref(null),
            singleDataNames:[]
        }, others));
    }
}
