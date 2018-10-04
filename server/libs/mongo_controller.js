const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

var getStringMongo = (callback) => {
	try {
        var path = "./libs/mongoConnection.json";
        var txt = fs.readFileSync(path, "utf-8");
        var result = Function("return " + txt)();
        var dbConfig;
        dbConfig = result;
        return dbConfig;
    } catch (ex) {
    	console.log(ex);
    }
}

var cnn = (dbConfig, database, callback) => {
	MongoClient.connect(dbConfig, (err, client) => {
		callback(err, client.db(database));
	})
}

var mapingData = (db, arrQuery, dataObj, callback) => {
	var val = {};
	arrQuery["dataMapField"].forEach((v) => {
		if(v["filed_from"] == "LevelCode"){
			var keys = v["filed_from"];
			var value = v["filed_to"];
			if(dataObj[keys])
				val[value] = JSON.parse(JSON.stringify(dataObj[keys])).slice(1).slice(0, -1).split("$");
			else
				val[value] = null; 
		} else {
			var keys = v["filed_from"];
			var value = v["filed_to"];
			console.log(keys + "======" + JSON.parse(JSON.stringify(dataObj[keys])));
			val[value] = JSON.parse(JSON.stringify(dataObj[keys]));
		}
	})

	callback(db, arrQuery, val)
}

var checkExitsData = (db, arrQuery, dataObj, callback) => {
	dataObj.forEach((val) => {
		//
		var where = {};
		arrQuery["dataMapField"].forEach((data) => {
			if(data["primary_key"]){
				var keys = data["filed_from"];
				var value = data["filed_to"];
				where[value] = val[keys];
			}
		})
		//
		db.collection(arrQuery["to_table"]).findOne(where, (err, result) => {
			if(err){
				return;
			}
			if(!result){
				mapingData(db, arrQuery, val, callback);
			}
		})
	})
}

var insertOneData = (dbConfig, database, arrQuery, dataObj, callback) => {
	cnn(dbConfig, database, (err, db) => {
		if(err) return;
		checkExitsData(db, arrQuery, dataObj, (db, arrQuery, dataObj) => {
			db.collection(arrQuery["to_table"]).insert(dataObj, function(err, res) {
			    if (err) { 
					console.log(err);
					return;		    	
			    }
		    });
		});
	})
}



module.exports = {
    getStringMongo: getStringMongo,
    insertOneData: insertOneData
}