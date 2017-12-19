// ElasticSearch flows that don't affect states

import Promise from 'bluebird';
import elasticsearch from 'elasticsearch';

const esClient = new elasticsearch.Client({
    host: process.env.REACT_APP_ES_ENDPOINT,
    log: 'trace'
});

// TODO : convert query state into es query json
export default class Es{
      constructor(){
          this.esClient = esClient
      }

      search(queryString) {
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
    
     cat_indices(queryString){
        try{
            const query = JSON.parse(queryString);
            return esClient.cat.indices(query)
                .catch((err) => {
                    console.trace('es.js::cat() Error', err.message);
                });
        }catch(err){
            console.log('es.js::cat() Error', err.toString());
            return Promise.reject(err);
        }
    }
    
     indices_get(queryString){
        try{
            const query = JSON.parse(queryString);
            return esClient.indices.get(query)
                .catch((err) => {
                    console.trace('es.js::get() Error', err.message);
                });
        }catch(err){
            console.log('es.js::get() Error', err.toString());
            return Promise.reject(err);
        }
    }

    saveDataSource(name, data){
        return esClient.create({
            index: 'query',
            type: 'history',
            id:name,
            body: data
        })
    }
    delDataSource(name){
        return esClient.delete({
            index: 'query',
            type: 'history',
            id:name
        })
    }
    

}


