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
         chart1: {}
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
         let totalcaptures = res.a + res.b + res.c + res.d +
         res.e + res.f + res.g + res.h + res.queen + res.king +
         res.rook + res.knight + res.bishopb + res.bishopw;

         let options = {
            animationEnabled: true,
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
               title: "Percent of Captures"
            },
            data: [{
               type: "bar",
               name: "Pieces",
               axisYType: "secondary",
               color: "#014D65",
               dataPoints: [
                  { y: (res.a/totalcaptures) * 100, label: "a-pawn" },
                  { y: (res.b/totalcaptures) * 100, label: "b-pawn" },
                  { y: (res.c/totalcaptures) * 100, label: "c-pawn" },
                  { y: (res.d/totalcaptures) * 100, label: "d-pawn" },
                  { y: (res.e/totalcaptures) * 100, label: "e-pawn" },
                  { y: (res.f/totalcaptures) * 100, label: "f-pawn" },
                  { y: (res.g/totalcaptures) * 100, label: "g-pawn" },
                  { y: (res.h/totalcaptures) * 100, label: "h-pawn" },
                  { y: (res.queen/totalcaptures) * 100, label: "queen" },
                  { y: (res.king/totalcaptures) * 100, label: "king" },
                  { y: ((res.rook/2)/totalcaptures) * 100, label: "rook" },
                  { y: ((res.knight/2)/totalcaptures) * 100, label: "knight" },
                  { y: (res.bishopb/totalcaptures) * 100, label: "Black Bishop" },
                  { y: (res.bishopw/totalcaptures) * 100, label: "White Bishop" }
               ]
            }]}
            
         options.data[0].dataPoints.sort(this.compareDataPointYAscend);
         this.setState({title: "results", chart1: options});
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
                     <p>Please click the user that you want to analyze.</p>
                  </div>
                  <div className="flex-horiz">
                     <div className="flex-column">
                        <Game updateGame={this.updateGame} position={this.state.position} moves={this.state.moves} 
                              currentmove={this.state.current} history={this.state.history} board={this.state.board}/>
                     </div>
                     <SelectDisplay userid={this.state.userInfo.id} updateDisplay={this.updateDisplay} title={this.state.title} analyzeUser={this.analyzeUser}/>
                  </div>  
               </div> :null}

               {this.state.title === 'results' ?
               <div>
                  <div className="flex-horiz">
                     <div className="flex-column">
                        <Game updateGame={this.updateGame} position={this.state.position} moves={this.state.moves} 
                              currentmove={this.state.current} history={this.state.history} board={this.state.board}/>
                     </div>
                     <SelectDisplay userid={this.state.userInfo.id} updateDisplay={this.updateDisplay} title={this.state.title} analyzeUser={this.analyzeUser}/>
                  </div>  
                  <Charts chart1={this.state.chart1} />
               </div> :null}
         </div>
      );
   }
}
export default Page;
