const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
var _client = null;

// đóng connection của Mongodb

var fnCloseConnMongodb = (db) => {
	_client.close();
	return;
}

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
	console.log("Connect to Mongodb");
	MongoClient.connect(dbConfig, (err, client) => {
		var db = client.db(database);
		_client = client;
		if(err) {
			fnCloseConnMongodb(client);
			return;
		}
		callback(err, db);
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
			val[value] = JSON.parse(JSON.stringify(dataObj[keys]));
		}
	})

	callback(db, arrQuery, val)
}

var checkExitsData = (db, client, arrQuery, dataObj, callback) => {
	console.log("checkExitsData");
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
			console.log("checkExitsData findone");
			if(err){
				fnCloseConnMongodb(db);
				return;
			}
			if(!result){
				mapingData(db, arrQuery, val, callback);
			}else{
				count_mongodb++;
			}
		})
	})

	var exec = (db) => {
		console.log(count_mongodb, dataObj.length)

		if(count_mongodb == dataObj.length){
			fnCloseConnMongodb(db);
			count++;
		} else {
			setTimeout(function(){
				exec();
			}, 100);
		}
	};
	exec(db);
}

var insertOneData = (dbConfig, database, arrQuery, dataObj, callback) => {
	console.log("Insert One Data");
	cnn(dbConfig, database, (err, db, client) => {
		if(err) { 
			return; 
		}
		checkExitsData(db, client, arrQuery, dataObj, (db, arrQuery, dataObj) => {
			db.collection(arrQuery["to_table"]).insert(dataObj, function(err, res) {
			    if (err) { 
					fnCloseConnMongodb(client);
					return;		    	
				}
				count_mongodb++;
				console.log("Xong roi Mongodb");
		    });
		});
	})
}



module.exports = {
    getStringMongo: getStringMongo,
    insertOneData: insertOneData
}