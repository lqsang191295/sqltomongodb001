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
    console.log("Gọi qua mongo db")
    /*Lấy connection của Mongodb*/
    var dataConfigMongo = mongo_controllers.getStringMongo();
    //
    mongo_controllers.insertOneData(dataConfigMongo.connection, dataConfigMongo.database, 
        arrQuery, result);
}
//
var i = 0;
function getArrayQuery (conn, reqConn, callback, i) {
    i++;
    console.log("Start Services", i);
    return new Promise((resolve, reject) => {
        fs.readFile("libs/writeFileQuery.json", 'utf8', function(err, data) {
            if(err) {
                res.send(err)
                return ;
            }
            console.log("Data Files", i);
            if(callback) {
                Promise.all([
                    (() => {
                        callback(
                            conn, 
                            reqConn, 
                            data ? JSON.parse(data) : [], 
                            calbackAfterGetData, 
                            () => {
                                getArrayQuery(conn, reqConn, callback, i);
                            })
                        })()
                ]).then(function(values) {
                    //setTimeout(function (){
                    //});
                })
            }
        }); 
    });
    /*return new Promise((resolve, reject) => {
        Promise.all([
            (() => {
                fs.readFile("libs/writeFileQuery.json", 'utf8', function(err, data) {
                    if(err) {
                        res.send(err)
                        return ;
                    }
                    console.log("Data Files");
                    if(callback) callback(conn, reqConn, data ? JSON.parse(data) : [], calbackAfterGetData)
                }); 
            })()
        ]).then(function(values) {
            console.log("End Services");
            setTimeout(function(){
                getArrayQuery(conn, reqConn, callback);
            }, 1000);
        });
    });*/
    
}
//

function runServices (callback) {
    conn.close();
    conn.connect(async function (err) {
        if(err) {
            return;
        };
        await getArrayQuery(conn, reqConn, sql_controllers.execSQL, i);
    })
}
//
runServices();