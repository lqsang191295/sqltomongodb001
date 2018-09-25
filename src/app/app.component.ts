import { Component } from '@angular/core';
import { Http, HttpModule, Headers, Jsonp } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My First Angular App!';
  obj = {
    user: "sa",
    password: "@bc123",
    server: "172.16.0.126\\sql2005",
    database: "ERPFW",
    port: 1433
  };

  objMongo = {
    connection: "mongodb://localhost:27017",
    database: "lms"
  }

  dataQueryTb = [
    {
      tb_query: "demo",
      tb_primary_key: [
        {"Demo": "demo"}
      ],
      tb_name: "tbDemo",
      tb_map_filed: [
        {"Demo": "demo"}
      ]
    }
  ]

  constructor(private http: Http){
    this.readDataConfigSQL();
    this.readDataConfigMONGO();
    this.readDataQuery();
  }

  // Get data config SQL
  readDataConfigSQL (){
    const url = "http://localhost:3000/readFile";
    this.http.get(url)
    .toPromise()
    .then(res => {
      var data = JSON.parse(res["_body"]);
      if(data){
        this.obj.user = data.user;
        this.obj.password = data.password;
        this.obj.server = data.server;
        this.obj.database = data.database;
        this.obj.port = data.port;
      }
    })
  }

  // Get data config MONGODB
  readDataConfigMONGO (){
    const url = "http://localhost:3000/readFileMongo";
    this.http.get(url)
    .toPromise()
    .then(res => {
      var data = JSON.parse(res["_body"]);
      if(data){
        this.objMongo.connection = data.connection;
        this.objMongo.database = data.database;
      }
    })
  }

  writeDataConfigSQL () {
    const url = "http://localhost:3000/writeFile";
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({data: this.obj});
    this.http.post(url, body, {headers})
    .toPromise()
    .then(res => res.text())
  }

  writeDataConfigMongo(){
    const url = "http://localhost:3000/writeFileMongo";
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({data: this.objMongo});
    this.http.post(url, body, {headers})
    .toPromise()
    .then(res => res.text())
  }


  dataQuery = {
    
  }

  readDataQuery () {
    const url = "http://localhost:3000/readFileQuery";
    this.http.get(url)
    .toPromise()
    .then(res => {
      var data = JSON.parse(res["_body"]);
      if(data){
        this.dataQueryTb = data;
      }
    })
  }

  saveDataQuery (){
    const url = "http://localhost:3000/writeFileQuery";
    const headers = new Headers({ 'Content-Type': 'application/json' });
    console.log(8888, this.dataQuery);
    if(this.dataQuery['tb_primary_key']){
      this.dataQuery['tb_primary_key'] = JSON.parse(this.dataQuery['tb_primary_key']);
    }
    if(this.dataQuery['tb_map_filed']){
      this.dataQuery['tb_map_filed'] = JSON.parse(this.dataQuery['tb_map_filed']);
    }
    const body = JSON.stringify({data: this.dataQuery});
    this.http.post(url, body, {headers})
    .toPromise()
    .then(res => {
      this.readDataQuery();
    })
  }

}
