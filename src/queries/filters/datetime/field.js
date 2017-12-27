import { terms } from '../../core/TermQuery';

export default (field, value) => terms({
    [field]: [].concat(value)
});
