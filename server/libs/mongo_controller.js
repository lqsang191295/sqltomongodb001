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

	arrQuery["tb_map_filed"].forEach((v) => {
		if(v.hasOwnProperty("type")){
			var keys = Object.keys(v);
			var value = Object.values(v);
			console.log(keys, value);
			keys.forEach((k, i) => {
				if(k != "type"){
					val[value[i]] = dataObj[k].slice(1).slice(0, -1).split("$");
				}
			})
		} else {
			var keys = Object.keys(v);
			var value = Object.values(v);
			val[value] = dataObj[keys];
		}
	})

	callback(db, arrQuery, val)
}

var checkExitsData = (db, arrQuery, dataObj, callback) => {
	dataObj.forEach((val) => {
		//
		var where = {};
		arrQuery["tb_primary_key"].forEach((data) => {
			var keys = Object.keys(data);
			var value = Object.values(data);
			where[value] = val[keys];
		})
		console.log("where", where);
		//
		db.collection(arrQuery["tb_name"]).findOne(where, (err, result) => {
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
			db.collection(arrQuery["tb_name"]).insert(dataObj, function(err, res) {
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