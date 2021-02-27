const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fetch = require("node-fetch");
/*Use middleware to process JSON for POST requests*/
app.use(bodyParser.json());

/*Apply COORS access control headers*/
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", 
      "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

/*Create connection to MySql database*/
const db = mysql.createConnection({
   host : 'localhost',
   user : 'root',
   password : '@WSX2wsx',
   database : 'project'

});

db.connect((err) => {
   if(err) throw err;
});

app.get('/games/mygames', (req, res) => {
   const Http = new XMLHttpRequest();
   const username = 'kcrisci';
   const url="https://api.chess.com/pub/player/" + username + "/games/archives";
   var array = {};
   var games = [];
   var urls = [];
   Http.open("GET", url);
   Http.send(null);
   Http.onreadystatechange = (e) => {
      if(Http.readyState === 4 && Http.status === 200) {
         console.log("Pulled all Archives for user: ", username);
         var json = JSON.parse(Http.responseText);
	 Promise.all(json.archives.map(async (id) => {
	      const response = await fetch(id).catch(e => {console.log("error")});
	      if(response){
		 var res = [];
                 try{
	            res = response.json();
		 }catch(e){
                    console.log("error");
		 }
	      }
	      return res;  
	 })).then(data => {
		 for(var j = 0; j<data.length; j++){
	            for(var k = 0; k<data[j].games.length; k++){
                       games.push(data[j].games[k]);
		    }
		 }

	      array.games = games;
	      res.send(array.games);
	 }).catch(function(error){
            console.log(error);
	 });
      }
   }   
      
});


//this is the port number specified in client .json file
const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
