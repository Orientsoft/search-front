import {observable, computed} from 'mobx';
import es from '../services/es';
var Es = new es()

class AppStore {
    @observable state = {
        queryResult: null,
        queryString: null,
        indexOptions: [],
        typeOptions: [],
        selectedIndex:'',
        selectedType:'',
        results:[]
    }

    constructor() {
        this.es = Es
        this.query = this.query.bind(this);
        this.showAllIndexs = this.showAllIndexs.bind(this);
        this.showAllTypes = this.showAllTypes.bind(this);
    }

    updateQueryString(queryString) {
        this.state.queryString = queryString;
        console.log(this.state.queryString);
    }

    showAllIndexs (){
        this.es.cat_indices(JSON.stringify({
            "format": "json",
            "h": 'index'
        })).then( (results) =>{
            this.state.indexOptions = results
        }).catch((err) => {
            console.log(err)
        });
    }

    showAllTypes (index){
        this.es.indices_get(JSON.stringify({
            "index": index, 
            "ignoreUnavailable": true,
            "includeDefaults": false
        })).then( (results) =>{
            var typeList = results[index].mappings;
            for (var key in typeList) {
                this.state.typeOptions.push(key)
            }
           
        }).catch((err) => {
            console.log(err)
        });

    }

    query(queryString) {
        // query from es
        return this.es.search(queryString).then((results) => {
            this.state.queryResult = results;
            return results
            console.log("queryResult",this.state.queryResult)
        }).catch((err) => {
            this.state.queryResult = err.message;
        });
    }

    typeChange(type) {
        return  this.es.search(JSON.stringify({
            "index": this.state.selectedIndex, 
            "type": this.state.type
        })).then((data) => {
            var arr = data.hits.hits
            for(var i = 0; i < arr.length; i++){
                this.state.results.push({
                    key: i,
                    name: arr[i]._id,
                    count: arr[i]._source.count
                })
            }
            console.log("this.state.results",this.state.results)
            return this.state.results;
        })
    }

    getQueries (name,data){
         this.es.saveDataSource(name,data).then((results) => {
            console.log("save",results)
        }).catch((err) => {
            console.log("err",err)
        });
    }

    delQueries (name){
        this.es.delDataSource(name).then((results) => {
            console.log("del",results)
        }).catch((err) => {
            console.log("err",err)
        });
    }



    @computed get resultString() {
        if (this.state.queryResult == null)
            return 'N/A';

        return JSON.stringify(this.state.queryResult);
    }
}

export default AppStore;
