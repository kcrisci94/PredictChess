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
const getData = (url, username, userid) => {
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
               let newsql1 = `INSERT INTO addedUsers(added_by, added_user) VALUES('${userid}', '${username}')`
               db.query(newsql1, (err, result) => {
                  if(err){
                     console.log("error adding to addedUsers table \n" + err);
                  }else{
                     console.log(result);
                  }
               });

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
   let openings = /openings\/.*UTCDate/g;
   for(var j = 0; j<data.length; j++){
      for(var k = 0; k<data[j].games.length; k++){
         var string = data[j].games[k].pgn;
         var date = '';
         var white = '';
         var black = '';
         var winner = '';
         var moves = [];
         var opening = ''
         var numMoves;
         string = string.replace(removenewlines, ''); //removes new lines from string
         string.replace(dateregex, (s, match) => {date = s.substring(7, 17).replace(/\./gm, '-');}); //parse date
         string.replace(White, (s, match) => {white = s.split('"')[1];}); //parse white player
         string.replace(Black, (s, match) => {black = s.split('"')[1];}); //parse black player
         string.replace(Winner, (s, match) => {winner = (s[0]==0)? "Black":"White"; }); //get winner
         string.replace(Moves, (s, match) => {moves.push(s.substr(2));}); //get moves (convert from array to a string to store)
         string.replace(openings, (s, match) => {opening = s.split('"')[0].split("/")[1]})
         numMoves = moves.length;

         var sql4 = `INSERT INTO games(url, datePlayed, whiteName, blackName, opening, winner, numMoves, moves) values('${data[j].games[k].url}','${date}', '${white}',
                       '${black}', '${opening}', '${winner}', '${numMoves}', '${moves.join(' ')}')`;
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
   const userid = req.body.userID;
   const url="https://api.chess.com/pub/player/" + username + "/games/archives";
   console.log(url)
   var array = {};
   var games = [];
   var urls = [];
   getData(url, username, userid);

});

/*gets list of user games from app database of downloaded games*/
app.post('/games/mygames', (req, res) => {
  const uname = req.body.username;
  const sql = `SELECT * FROM games WHERE whiteName='${uname}' OR blackName='${uname}'`;
  db.query(sql, (err, result) => {
     if(err) throw err;
     if(result){
        console.log("found games");
        res.send(result);
     }else{
        console.log("no games found");
        res.send(null);
     }
  });
});

/*gets a list of users that a user has added to their list of games*/
app.post('/getAddedUsers', (req, res) => {
   const userid = req.body.userid;
   const sql = `SELECT added_user from addedUsers where added_by = '${userid}'`;
   db.query(sql, (err, result) => {
      if(err) throw err;
      if(result){
         console.log("found added users");
         res.send(result);
      }else{
         console.log("no added users found");
         res.send(null);
      }
   });
});

app.post('/updateDisplay', (req, res) => {
   console.log("entering updateDisplay function")
   const uname = req.body.username;
   const sql = `SELECT * FROM games WHERE whiteName='${uname}' OR blackName='${uname}'`
   db.query(sql, (err, result) => {
      if(err) throw err;
      if(result){
         console.log("found user's games");
         res.send(result);
      }else{
         console.log("no games found");
         res.send(null);
      }
   });
});

app.post('/analyzeUser', (req, res) => {
   const uname = req.body.username;
   console.log("Analyzing user: ", uname);
   const sql = `SELECT * FROM games WHERE whiteName='${uname}' OR blackName='${uname}'`
   db.query(sql, (err, result) => {
      if(err) throw err;
      let captures = {};
      if(result){
         captures = getNumCaptures(result, uname);
         res.send(captures);
      }else{
         console.log("Can't Analyze User");
         res.send(null);
      }
   });
});

const getNumCaptures = (result, uname) => {
   let i = 0; 
   let retObj = {location_to_take: [], location_taken: [], pieces_captured: {queen: 0, knight: 0, bishopw: 0, bishopb: 0, rook: 0, king: 0, a: 0, b: 0, c: 0, d: 0, e:0, f: 0, g: 0, h:0}}
   let playermoves = [];
   let othermoves = []
   let matrix = [];
   let k;
   for(k=0; k<8; k++) {
         matrix[k] = new Array(8).fill(0);
   }

   let matrix2 = [];
   for(k=0; k<8; k++) {
         matrix2[k] = new Array(8).fill(0);
   }

   for(i = 0; i < result.length; i++){
      let game = result[i];
      let allmoves = game.moves.split(" ");
      let j = 0;

      /* Store user moves in 2 separate arrays */
      if(game.whiteName == uname){
         for(j = 0; j < allmoves.length; j++){
            if(j % 2 == 0){
                playermoves.push(allmoves[j]);
            }else{
               othermoves.push(allmoves[j]);
            }
         }
      }else{
         for(j = 0; j < allmoves.length; j++){
            if(j % 2 != 0){
                playermoves.push(allmoves[j]);
            }else{
               othermoves.push(allmoves[j]);
            }
         }
      }
      //console.log(playermoves);

      let square, square2, piece, piece2;
      let column, row;

      for(j = 0; j < othermoves.length; j++){
         if(othermoves[j].includes("x")){
            let pieceidx = othermoves[j].indexOf("x"); //get index of capturing piece
            square2 = othermoves[j][pieceidx + 1];
            row = othermoves[j][pieceidx + 2];
               if(square2 == "a"){
                  column = 0;
               }else if(square2 == "b"){
                  column = 1;
               }else if(square2 == "c"){
                  column = 2;
               }else if(square2 == "d"){
                  column = 3;
               }else if(square2 == "e"){
                  column = 4;
               }else if(square2 == "f"){
                  column = 5;
               }else if(square2 == "g"){
                  column = 6;
               }else if(square2 == "h"){
                  column = 7;
               }

               matrix2[column][row-1] = matrix2[column][row-1] + 1;
            }
      }
      for(j = 0; j < playermoves.length; j++){
         if(playermoves[j].includes("x")){
            let pieceidx = playermoves[j].indexOf("x"); //get index of capturing piece
            if(pieceidx == 2){
               pieceidx == 0;
            }else{
               pieceidx = pieceidx-1;
            }

            // Determine where player likes to capture pieces
            
            
            square = playermoves[j].slice(pieceidx + 2);
            piece = playermoves[j][pieceidx];

            if(square[0] == "a"){
               column = 0;
            }else if(square[0] == "b"){
               column = 1;
            }else if(square[0] == "c"){
               column = 2;
            }else if(square[0] == "d"){
               column = 3;
            }else if(square[0] == "e"){
               column = 4;
            }else if(square[0] == "f"){
               column = 5;
            }else if(square[0] == "g"){
               column = 6;
            }else if(square[0] == "h"){
               column = 7;
            }
            
            matrix[column][square[1]-1] = matrix[column][square[1]-1] + 1;

            /* Determine captured  Piece*/
            if(piece == piece.toLowerCase()){ //pawn capture
               if(piece == "a"){
                  retObj.pieces_captured.a = retObj.pieces_captured.a + 1;
               }else if(piece == "b"){
                  retObj.pieces_captured.b = retObj.pieces_captured.b + 1;
               }else if(piece == "c"){
                  retObj.pieces_captured.c = retObj.pieces_captured.c + 1;
               }else if(piece == "d"){
                  retObj.pieces_captured.d = retObj.pieces_captured.d + 1;
               }else if(piece == "e"){
                  retObj.pieces_captured.e = retObj.pieces_captured.e + 1;
               }else if(piece == "f"){
                  retObj.pieces_captured.f = retObj.pieces_captured.f + 1;
               }else if(piece == "g"){
                  retObj.pieces_captured.g = retObj.pieces_captured.g + 1;
               }else if(piece == "h"){
                  retObj.pieces_captured.h = retObj.pieces_captured.h + 1;
               }
            }else{ // non-pawn capture
               if(piece == "N"){
                  retObj.pieces_captured.knight = retObj.pieces_captured.knight + 1;
               }else if(piece == "R"){
                  retObj.pieces_captured.rook = retObj.pieces_captured.rook + 1;
               }else if(piece == "Q"){
                  retObj.pieces_captured.queen = retObj.pieces_captured.queen + 1;
               }else if(piece == "B"){
                  if(square[0] == "a" || square[0] == "c" || square[0] == "e" || square[0] == "g"){
                     if(square[1] % 2 == 0){
                        retObj.pieces_captured.bishopw = retObj.pieces_captured.bishopw + 1;
                     }else{
                        retObj.pieces_captured.bishopb = retObj.pieces_captured.bishopb + 1;
                     }
                  }else if(square[0] == "b" || square[0] == "d" || square[0] == "f" || square[0] == "h"){
                     if(square[1] % 2 == 0){
                        retObj.pieces_captured.bishopb = retObj.pieces_captured.bishopb + 1;
                     }else{
                        retObj.pieces_captured.bishopw = retObj.pieces_captured.bishopw + 1;
                     }

                  }
               }else if(piece == "K"){
                  retObj.pieces_captured.king = retObj.pieces_captured.king + 1;
               }
            }
         }
      }
      playermoves = [];
      othermoves = [];
   }
   retObj.location_to_take = matrix;
   retObj.location_taken = matrix2;
   return retObj;
   //res.send(result);

}

//this is the port number specified in client .json file
const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
