const express = require("express");
const jsonParer = require("body-parser").json();
const app = express();
const fs = require('fs');

const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.get("/", (req, res) => {
    res.send("Hello");
});

app.get("/readFile", jsonParer, (req, res) => {
    fs.readFile("libs/sqlConnection.json", 'utf8', function(err, data) {
        console.log(data)
        if(err) {
            res.json(false);
            return res.send(err);
        }
        return res.send(JSON.parse(data));
    }); 
})

app.post("/writeFile", jsonParer, (req, res) => {
    fs.writeFile("libs/sqlConnection.json", JSON.stringify(req.body.data), function(err) {
        if(err) {
            res.send(false);
        }
        res.send(true);
        return true;
    }); 
})

app.get("/readFileMongo", jsonParer, (req, res) => {
    fs.readFile("libs/mongoConnection.json", 'utf8', function(err, data) {
        if(err) {
            res.json(false);
            return;
        }
        return res.send(JSON.parse(data));
    }); 
})

app.post("/writeFileMongo", jsonParer, (req, res) => {
    fs.writeFile("libs/mongoConnection.json", JSON.stringify(req.body.data), function(err) {
        if(err) {
            res.send(false);
        }
        res.send(true);
        return true;
    }); 
})

app.get("/readFileQuery", jsonParer, (req, res) => {
    // lay data
    fs.readFile("libs/writeFileQuery.json", 'utf8', function(err, data) {
        if(err) {
            res.send(err)
            return ;
        }
        return res.send(data ? JSON.parse(data) : []);
    }); 
})

app.post("/writeFileQuery", jsonParer, (req, res) => {
    // lay data
    fs.readFile("libs/writeFileQuery.json", 'utf8', function(err, data) {
        if(err) {
            return res.send(err);
        }
        var dt = data ? JSON.parse(data) : [];
        dt.push(req.body.data);
        fs.writeFile("libs/writeFileQuery.json", JSON.stringify(dt), function(err) {
            if(err) {
                res.send(false);
            }
            res.send('test')
            return true;
        }); 
    }); 
})

app.post("/runServices", jsonParer, (req, res) => {
    console.log(55677888);
    const sql_controllers = require('./libs/sql_controller');
    const mongo_controllers = require('./libs/mongo_controller');
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
    conn.close();
    conn.connect(function (err) {
        console.log(123123, err);
        if(err) {
            return;
        };
        setInterval(() => {
            getArrayQuery(conn, reqConn, sql_controllers.execSQL);
        }, 1000);
    })

})

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.listen(3000, () => {
    console.log("Server is running");
});



