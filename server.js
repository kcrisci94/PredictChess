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
   database : 'project2'

});

db.connect((err) => {
   if(err) throw err;
});

const getData = async (url) => {
   const request = await fetch(url);
   if(request){
	var data;
      try{
         data = await request.json();
      }catch{
         console.log("error");
      }

      return data;
   }
}
const parseData = (data) => {
   var removenewlines = /(\n)+/g;
   var dateregex = /\[Date \"(.*?)\"/gm;
   var White = /White \"(.*?)\"/gm;
   var Black = /Black \"(.*?)\"/gm;
   var Winner = /[01]-[01]/;
   var Moves = /\. (O-O|[A-R][a-h][1-8][a-h][1-8]|[a-h][1-8]\=[A-R]|[a-h][1-8]|[A-R][a-h][1-8]|[A-R][a-h][a-h][1-8]|[A-R][1-8][a-h][1-8]|[a-h]x[a-h][1-8]|[A-R]x[a-h][1-8]|[A-R][a-h]x[a-h][1-8])\+?/g;
   for(var j = 0; j<data.length; j++){
      for(var k = 0; k<data[j].games.length; k++){
         var string = data[j].games[k].pgn;
         var date = '';
         var white = '';
         var black = '';
         var winner = '';
         var moves = [];
         var numMoves;
         string = string.replace(removenewlines, ''); //removes new lines from string
         string.replace(dateregex, (s, match) => {date = s.substring(7, 16).replace(/\./, '-');}); //parse date
         string.replace(White, (s, match) => {white = s.split('"')[1];}); //parse white player
         string.replace(Black, (s, match) => {black = s.split('"')[1];}); //parse black player
         string.replace(Winner, (s, match) => {winner = (s[0]==0)? "Black":"White"; }); //get winner
         string.replace(Moves, (s, match) => {moves.push(s.substr(2));}); //get moves (convert from array to a string to store)
         numMoves = moves.length;

         var sql4 = `INSERT INTO games(url, datePlayed, whiteName, blackName, winner, numMoves, moves) values('${data[j].games[k].url}','${date}', '${white}',
                       '${black}', '${winner}', '${numMoves}', '${moves.join(' ')}')`;
         db.query(sql4, (err, result) => {
            if(err){
               console.log("error inserting game \n" + err);
            }else{
               console.log(result);
            }
          });
      }
   }
}

app.post('/createUser', (req, res) => {
   const fname = req.body.firstName;
   const lname = req.body.lastName;
   const uname = req.body.username;
   const chessUname = req.body.chessUname;
   const sql = `INSERT INTO users(firstName, lastName, username, chessUsername, password) 
      VALUES('${fname}', '${lname}', '${uname}', '${chessUname}', '${req.body.pword}')`;
   db.query(sql, (err, result) => {
      if(err) {
         res.send("Please create a unique username")
      }else{
         console.log("User created");
         console.log(result);
         res.send(result);
      }
   });
});

/**
 * Check that username and passwords match
 * If they don't match, return 'null' to client
 * Otherwise, return user information
 */
app.post('/checkUser', (req, res) => {
   const uname = req.body.username;
   const sql = `SELECT firstName, lastName, username, chessUsername, id FROM users
      WHERE username = '${uname}' AND password = '${req.body.pword}'`;
   db.query(sql, (err, result) => {
      if(err) throw err;
      if(result){
         console.log("Found User");
         console.log(result);
         res.send(result);
      }else{
         console.log("No user found");
         res.send(null);
      }
   });
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
	 var urls = json.archives;
	 var i;
	 var sql1;
         var result;
	 Promise.all(urls.map(async (id) => {
	   result = await getData(id); 
	   return result;
	 })).then( data => {
	    parseData(data);
	 }).catch(function(error){
            console.log(error);
	 });
      }
   }   
      
});


//this is the port number specified in client .json file
const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
