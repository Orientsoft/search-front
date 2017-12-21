import { observable } from 'mobx';

/**
 * 应用级Store
 * 保存全局数据、状态及方法
 */
export default class AppStore {
    // 保存全局查询结果
    @observable.ref queryResult = {};
    // 保存查询错误
    @observable.ref queryError = null;
    @observable singleDataNames = [];
    @observable currentAggs = [];
    @observable multipleDataNames = [];
    @observable.ref singleDataType = '';
    @observable singleDatas = [];
}
