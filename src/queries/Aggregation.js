import { extendObservable } from 'mobx';
import isString from 'lodash/isString';
import merge from 'lodash/merge';
import get from 'lodash/get';

class Aggregation {
    constructor(name, initialAgg = {}) {
        extendObservable(this, {
            body: {
                aggs: {
                    [name]: initialAgg
                }
            }
        });
    }

    with(otherAgg) {
        return new Aggregation(merge(
            this.toJSON(),
            otherAgg instanceof Aggregation ? otherAgg.toJSON() : otherAgg
        ));
    }

    toJSON(path) {
        const body = this.body.toJS();

        if (isString(path) || Array.isArray(path)) {
            return get(body, path, {});
        }

        return body;
    }
}

export default Aggregation;
