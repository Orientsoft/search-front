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
                sources: observable.ref([]),
                // 所有指标
                metrics: observable.ref([]),
                // 所有系统
                systems: observable.ref([])
            },
            // 当前选择的系统和指标
            selectedConfig: {
                system: null,
                metrics: observable.ref([]),
                sources: observable.ref([])
            }
        });
    }
}

export default new AppStore();
