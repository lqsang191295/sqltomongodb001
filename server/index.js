const express = require("express");
const jsonParer = require("body-parser").json();
const app = express();
const fs = require('fs');
const cors = require('cors');
var Service = require('node-windows').Service;
var path = require("path");
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
    var svc = new Service({
        name: 'hcs_services_async_sql_mongo',
        description: 'Hcs đồng bộ dữ liệu từ sql sang mongodb',
        script: path.join(__dirname, "services.js")
    });
    svc.on('install', function () {
        svc.start();
    });
    svc.install();
})

app.post("/uninstallServices", jsonParer, (req, res) => {
    console.log(123, path.join(__dirname, "services.js"));
    var svc = new Service({
        name: 'hcs_services_async_sql_mongo',
        script: path.join(__dirname, "services.js")
    });
    console.log(7888);
    // Listen for the "uninstall" event so we know when it's done.
    svc.on('uninstall', function () {
        console.log('Uninstall complete.');
        console.log('The service exists: ', svc.exists);
    });
    console.log(6666);
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



