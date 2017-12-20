import { extendObservable } from 'mobx';
import isString from 'lodash/isString';
import merge from 'lodash/merge';
import get from 'lodash/get';

class Query {
    constructor(initialQuery = {}) {
        extendObservable(this, {
            body: {
                query: initialQuery
            }
        });
    }

    with(otherQuery) {
        return new Query(merge(
            this.toJSON(),
            otherQuery instanceof Query ? otherQuery.toJSON() : otherQuery
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

export default Query;
