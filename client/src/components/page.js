import React, { Component } from 'react';

import Game from './game';
import Gamelist from './gamelist';
import Login from './login';
import Signup from './signup';
import Options from './options';
import SelectDisplay from './selectdisplay';
import Charts from './charts';
import * as CanvasJS from 'canvasjs';
import './page.css';


const {Chess} = require("./chess.js");

/**
 * Page
 * Rendered By: App.js
 */
class Page extends Component {
   constructor() {
      super();
      this.state = {
         title: 'Login',
         userInfo: {}, 
         board: {}, 
         moves: [],
         position: 'start',
         current: -1, 
         history: [],
         alllist: [],
         display: [], 
         chart1: {}, 
         squares_taken: [],
         squares_to_take: []
      };
   }

   componentDidMount() {
      const chess = Chess();
      this.setState({board: chess});
   }
  
   startGame = (moves) => {
      this.setState({moves: moves, position: 'start', current: -1, history: [], board: Chess()});
   }

   updateGame = (position, currentmove, history, board) => {
      this.setState({position: position, current: currentmove, history: history, board: board})
   }
   
   editUser = (stats) => {
      console.log(stats)
      this.setState({
         userInfo: stats,
         title: "Game",
      });
      fetch('/games/mygames', {
         method: 'POST',
         headers: {'Content-Type': 'application/json; charset=utf-8'},
         body: JSON.stringify({username: stats.chessUsername})
      })
      .then(res => res.json())
      .then(stats => {
         this.setAlllist(stats);
      })
      .catch(err => {console.log("Error in fetch... ", err)});
   }
   
   setAlllist = (stats) => {
      this.setState({alllist: stats});
      this.setDisplay();
   }

   setDisplay = () => {
      let list = this.state.alllist;
      let display = [];
      let j;
      for(j=list.length-1; j>list.length-11; j--){
         display.push(list[j]);
      }
      this.setState({display: display});
   }

   toSignup = () => {
      this.setState({
         title: "SignUp"
      });
   }
   
   updateDisplay = (username) => {
      fetch('/updateDisplay', {
         method: 'POST',
         headers: {'Content-Type': 'application/json; charset=utf-8'},
         body: JSON.stringify({username: username})
      })
      .then(res => res.json())
      .then(stats => {
         this.setAlllist(stats);
      }).then(() => {this.setDisplay();})
      .catch(err => {console.log("Error in fetch... ", err)});
   }

   analysis_mode = () => {
      this.setState({
         title: "Analyze"
      });
   }

   game_mode = () => {
      this.setState({
         title: "Game"
      });
   }

   compareDataPointYAscend = (dataPoint1, dataPoint2) => {
      return dataPoint1.y - dataPoint2.y;
   }

   analyzeUser = (user) => {
      fetch('/analyzeUser', {
         method: 'POST',
         headers: {'Content-Type': 'application/json; charset=utf-8'},
         body: JSON.stringify({username: user})
      })
      .then(res => res.json())
      .then(res => {
         let options = {
            animationEnabled: true,
            height: 300,
            width: 500,
            title:{
               text:"Captures Made By Pieces"
            },
            axisX:{
               interval: 1,
               title: "Piece"

            },
            axisY2:{
               interlacedColor: "rgba(1,77,101,.2)",
               gridColor: "rgba(1,77,101,.1)",
               title: "# of Captures"
            },
            data: [{
               type: "bar",
               name: "Pieces",
               axisYType: "secondary",
               color: "#014D65",
               dataPoints: [
                  { y: res.pieces_captured.a, label: "a-pawn" },
                  { y: res.pieces_captured.b, label: "b-pawn" },
                  { y: res.pieces_captured.c, label: "c-pawn" },
                  { y: res.pieces_captured.d, label: "d-pawn" },
                  { y: res.pieces_captured.e, label: "e-pawn" },
                  { y: res.pieces_captured.f, label: "f-pawn" },
                  { y: res.pieces_captured.g, label: "g-pawn" },
                  { y: res.pieces_captured.h, label: "h-pawn" },
                  { y: res.pieces_captured.queen, label: "Queen" },
                  { y: res.pieces_captured.king, label: "King" },
                  { y: res.pieces_captured.rook/2, label: "Rook" },
                  { y: res.pieces_captured.knight/2, label: "Knight" },
                  { y: res.pieces_captured.bishopb, label: "Black Bishop" },
                  { y: res.pieces_captured.bishopw, label: "White Bishop" }
               ]
            }]}
         console.log(res.location_taken);   
         options.data[0].dataPoints.sort(this.compareDataPointYAscend);
         let arr1 = res.location_taken;
         let arr2 = res.location_to_take;
         
         this.setState({title: "results", chart1: options, squares_taken: arr1, squares_to_take: arr2});
   });

   }

   render() {
      return (
         <div id="board">
            <h1>Predict Chess</h1>
            {this.state.title === 'Login' ? 
            <Login handleChange={this.editUser} 
               toSignup={this.toSignup}/> : null}

            {this.state.title === "SignUp" ? <Signup
                  handler={this.editUser}/> : null}

            {this.state.title === 'Game' ?
               <div>
                  <button type="button" className="analyze" onClick={this.analysis_mode}>Analyze a User</button>
                  <p>Download and play through games, or manually play moves</p>
                  <div className="flex-horiz">
                     <Options chess_uname={this.state.userInfo.chessUsername} userid={this.state.userInfo.id} analyze={this.analysis_mode}/> 
                     <div className="flex-column">
                        <Game updateGame={this.updateGame} position={this.state.position} moves={this.state.moves} 
                              currentmove={this.state.current} history={this.state.history} board={this.state.board}/>
                        <div className='moves'>
                           <p>{this.state.moves.join(" ")}</p>
                        </div>
                        <Gamelist startGame={this.startGame} username={this.state.userInfo.chessUsername} setAlllist={this.setAlllist} setDisplay={this.setDisplay} display={this.state.display} getmygames={this.setDisplay}/>
                     </div>
                     <SelectDisplay userid={this.state.userInfo.id} updateDisplay={this.updateDisplay} title={this.state.title} analyzeUser={this.analyzeUser}/>
                  </div>
                  
               </div> :null}

               {this.state.title === 'Analyze' ?
               <div>
                  <div id="visible">
                  <button type="button" className="viewgames" onClick={this.game_mode}>View Games</button>
                     <p>Please click the user that you want to analyze.</p>
                  </div>
                  <div className="flex-horiz">
                    
                     <SelectDisplay userid={this.state.userInfo.id} updateDisplay={this.updateDisplay} title={this.state.title} analyzeUser={this.analyzeUser}/>
                  </div>  
               </div> :null}

               {this.state.title === 'results' ?
               <div>
                  <button type="button" className="analyze" onClick={this.game_mode}>View Games</button>
                  <p>Please click the user that you want to analyze.</p>
                  <div className="flex-horiz">
                     
                     <SelectDisplay userid={this.state.userInfo.id} updateDisplay={this.updateDisplay} title={this.state.title} analyzeUser={this.analyzeUser}/>
                  </div>  
                  <Charts chart1={this.state.chart1} squaresTaken = {this.state.squares_taken} squaresToTake = {this.state.squares_to_take}/>
               </div> :null}
         </div>
      );
   }
}
export default Page;
