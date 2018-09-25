const sql_controllers = require('./libs/sql_controller');
const mongo_controllers = require('./libs/mongo_controller');
const fs = require('fs');
/* Lấy connection của SQL */
var dataSQL = sql_controllers.getStringSQL();
/* Gán connection */
var conn = dataSQL.conSQL;
var reqConn = dataSQL.reqCon;
/* Async Data from SQL to Mongodb */
var arrQuery = [
];
// 
var calbackAfterGetData = (result, arrQuery) => {
    /*Lấy connection của Mongodb*/
    var dataConfigMongo = mongo_controllers.getStringMongo();
    //
    mongo_controllers.insertOneData(dataConfigMongo.connection, dataConfigMongo.database, 
        arrQuery, result);
}
//
var getArrayQuery = (conn, reqConn, callback) => {
    fs.readFile("libs/writeFileQuery.json", 'utf8', function(err, data) {
        if(err) {
            res.send(err)
            return ;
        }
        if(callback) callback(conn, reqConn, data ? JSON.parse(data) : [], calbackAfterGetData)
    }); 
}
//
var runServices = (callback) => {
    conn.close();
    conn.connect(function (err) {
        console.log(123123, err);
        if(err) {
            return;
        };
        setInterval(() => {
            getArrayQuery(conn, reqConn, sql_controllers.execSQL);
        }, 500);
    })
}
//
runServices();
