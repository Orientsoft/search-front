import {observable, computed} from 'mobx';
import search from '../services/es';

class AppStore {
    @observable state = {
        queryResult: null,
        queryString: null
    }

    constructor() {
        this.query = this.query.bind(this);
    }

    updateQueryString(queryString) {
        this.state.queryString = queryString;
        console.log(this.state.queryString);
    }

    query() {
        // query from es
        search(this.state.queryString).then((results) => {
            this.state.queryResult = results;
        }).catch((err) => {
            this.state.queryResult = err.message;
        });
    }

    @computed get resultString() {
        if (this.state.queryResult == null)
            return 'N/A';

        return JSON.stringify(this.state.queryResult);
    }
}

export default AppStore;
