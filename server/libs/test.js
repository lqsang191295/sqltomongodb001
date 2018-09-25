const sql = require('mssql');
const fs = require('fs');
const str_sql = "";
var conSQL, reqCon;

var getStringSQL = (callback) => {
	try {
        var path = "./sqlConnection.json";
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
        console.log(123, dbConfig);
        getConectionSql(dbConfig, callback);
    } catch (ex) {
    	console.log(ex);
    }
}

var getConectionSql = (dbConfig, callback) => {
    var conn = new sql.ConnectionPool(dbConfig);
    var reqConnection = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            return err;
        }
        else {
            conSQL = conn;
            reqCon = reqConnection;
            return this;
        }
    });
}

var execSQL = (reqConnection, strQuery, callback) => {
	reqConnection.query(strQuery, (err, recordset) => {
		if(callback){
			callback(err, recordset);
		}
	})
}
