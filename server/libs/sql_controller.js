const sql = require('mssql');
const fs = require('fs');
const str_sql = "";
var conSQL, reqCon;

var getStringSQL = (callback) => {
	try {
        var path = "./libs/sqlConnection.json";
        var txt = fs.readFileSync(path, "utf-8");
        var result = Function("return " + txt)();
        var dbConfig = {
            server: null,
            database: null,
            user: null,
            password: null,
            port: null
        }
        dbConfig.server = result.server;
        dbConfig.database = result.database;
        dbConfig.user = result.user;
        dbConfig.password = result.password;
        dbConfig.port = result.port;
        return getConectionSql(dbConfig, callback);
    } catch (ex) {
    	console.log(ex);
    }
}

var getConectionSql = (dbConfig, callback) => {
    var conn = new sql.ConnectionPool(dbConfig);
    var reqConnection = new sql.Request(conn);
    this.conSQL = conn;
    this.reqCon = reqConnection;
    return this;
}
function execSQL (conn, reqCon, arrQuery, callback) {
    return new Promise((resolve, reject) => {
        function run(qr, callback){
            console.log("Hihihi123123");
            var dataMapField = qr["dataMapField"];
            var keys = "";
            if(dataMapField.length > 0){
                dataMapField.forEach(element => {
                    return keys += element["filed_from"] + ", ";
                });
            }
            keys = keys.slice(0, -2);
            var tb_query = "Select " + keys + " from " + qr["from_table"];
            console.log("Hihihi12312444444");
            reqCon.query(tb_query, (err, recordset) => {
                console.log("Haaaaaaa", 444);
                if(err){
                    return;
                }
                if(callback) {
                    callback(recordset.recordset, qr);
                }
            });
        }

        for(var i = 0; i < arrQuery.length; i++){
            xxx = i;
            console.log("Hihihi", i);
            var qr = arrQuery[i];
            new run(qr, callback);
            
        }  
    })    
}

module.exports = {
    getStringSQL: getStringSQL,
    execSQL: execSQL
}