import mobx, { observable } from 'mobx';
import isString from 'lodash/isString';
import merge from 'lodash/merge';
import get from 'lodash/get';

class Aggregation {
    constructor(name, initialAgg = {}) {
        this.body = observable({
            aggs: {
                [name]: initialAgg
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
        const body = mobx.toJS(this.body);

        if (isString(path) || Array.isArray(path)) {
            return get(body, path, {});
        }

        return body;
    }
}

export default Aggregation;
