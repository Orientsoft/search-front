import Query from './core/Query';

export default (field, value) => {
    return new Query({
        [field]: value
    });
};
