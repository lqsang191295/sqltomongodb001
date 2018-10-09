const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
MongoClient.connect("mongodb://172.20.4.106:27017/lms", (err, client) => {
    var db = client.db("lms");
    db.close();

    db.collection("lv.AD_Roles").findOne( (err, result) => {
        console.log(123, result);

    })
})