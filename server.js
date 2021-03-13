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

/* query dataset to look for the latest date that all games were downloaded to limit api calls
 * only add urls that are not already in the database
 */
const getData = (url, username) => {
      let i, games = []; //Games array to hold the list of games to parse and add to database

      //Sql to get list of all dates of games that have been downloaded by the player
      let sql = `SELECT DISTINCT datePlayed from games WHERE whiteName = '${username}' or blackName = '${username}'`;

      //Query the database for the list of names
      db.query(sql, (err, result) => {
         let lastdate = [], urls = [], urls2 = [], urldate = [];
         let request = new XMLHttpRequest();
         if(err){
            console.log("error getting dates \n" + err);
         }else{
            if(result.length > 1){  //if more than 1 date does not exist in database
               lastdate = result[result.length-2].datePlayed.substring(0, 7).split("-")
               
            }else{                 //if 1 or less dates are returned (always download)
               lastdate[0] = 0; 
               lastdate[1] = 0;
            }

            //Get list of possible urls from the archives
            request.open('GET', url, false);
            request.send(null);
            if(request.readyState == 4 && request.status === 200){
               urls = JSON.parse(request.responseText).archives;
               
               //Parse the string date values into integer values
               lastdate[0] = parseInt(lastdate[0]);
               lastdate[1] = parseInt(lastdate[1]);

               //Check for the months that the games are already in the database
               //Add months that haven't been downloaded a new array of urls
               for(i=0; i<urls.length; i++){
                  urldate = urls[i].slice(-7).split("/")
                  urldate[0] = parseInt(urldate[0]);
                  urldate[1] = parseInt(urldate[1]);
                  if(urldate[0] > lastdate[0]){
                     console.log("adding url: " + urls[i] + " from the list");
                     urls2.push(urls[i]);
                  }else if(urldate[0] == lastdate[0] && urldate[1] > lastdate[1]){
                     console.log("adding url: " + urls[i] + " from the list");     
                     urls2.push(urls[i])
                  }
               }
            }
            
            //Use new array of urls to send multiple synchronous requests to the api
            for(i=0; i<urls2.length; i++){
               request = new XMLHttpRequest();
               request.open('GET', urls2[i], false);
               request.send(null);
               if(request.readyState == 4 && request.status == 200){
                  games.push(JSON.parse(request.responseText))  //add games to the games array
               }
            }

            //Parse the array of games and add to the database
            if(games.length != 0){
               parseData(games);
            }else{
               console.log("No games to add.")
            }
         }
      });
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
         string.replace(dateregex, (s, match) => {date = s.substring(7, 17).replace(/\./gm, '-');}); //parse date
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
              // console.log(result);
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

/*Downloads games that have not yet been downloaded
 *Called by clicking on the "Download My Recent Games" button
 */
app.post('/getgames', (req, res) => {
   const Http = new XMLHttpRequest();
   const username = req.body.username;
   const url="https://api.chess.com/pub/player/" + username + "/games/archives";
   console.log(url)
   var array = {};
   var games = [];
   var urls = [];
   getData(url, username);
});


//this is the port number specified in client .json file
const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
