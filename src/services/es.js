// ElasticSearch flows that don't affect states

import Promise from 'bluebird';
import elasticsearch from 'elasticsearch';

const esClient = new elasticsearch.Client({
    host: process.env.REACT_APP_ES_ENDPOINT,
    log: 'trace'
});

// TODO : convert query state into es query json

export default function search(queryString) {
    try {
        const query = JSON.parse(queryString);
        // TODO : result handling
        return esClient.search(query)
            .catch((err) => {
                console.trace('es.js::search() Error', err.message);
            });
    } catch (err) {
        // TODO : error handing
        console.log('es.js::search() Error', err.toString());
        return Promise.reject(err);
    }
}
