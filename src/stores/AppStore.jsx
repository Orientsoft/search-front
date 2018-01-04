import { observable, extendObservable } from 'mobx';

/**
 * 应用级Store
 * 保存全局数据、状态及方法
 */
export class AppStore {
    constructor() {
        extendObservable(this, {
            // 保存全局查询结果
            queryResult: observable.ref({}),
            // 保存全局查询错误
            queryError: observable.ref(null),
            currentAggs: [],
            singleDataNames: [],
            multipleDataNames: [],
            singleDataType: '',
            singleDatas: [],
            config: {
                sources: {},
                // 所有指标
                metrics: [],
                // 所有系统
                systems: []
            },
            // 当前选择的系统和指标
            selectedConfig: {
                system: null,
                metrics: [],
                sources: []
            }
        });
    }
}

export default new AppStore();
