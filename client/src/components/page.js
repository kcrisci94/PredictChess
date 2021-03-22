import React, { Component } from 'react';

import Game from './game';
import Gamelist from './gamelist';
import Login from './login';
import Signup from './signup';
import Options from './options';
import SelectDisplay from './selectdisplay';
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
         display: []
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
                  <div className="flex-horiz">
                     <Options chess_uname={this.state.userInfo.chessUsername} userid={this.state.userInfo.id}/> 
                     <div className="flex-column">
                        <Game updateGame={this.updateGame} position={this.state.position} moves={this.state.moves} 
                              currentmove={this.state.current} history={this.state.history} board={this.state.board}/>
                        <div className='moves'>
                           <p>{this.state.moves.join(" ")}</p>
                        </div>
                        <Gamelist startGame={this.startGame} username={this.state.userInfo.chessUsername} setAlllist={this.setAlllist} setDisplay={this.setDisplay} display={this.state.display}/>
                     </div>
                     <SelectDisplay userid={this.state.userInfo.id} updateDisplay={this.updateDisplay}/>
                  </div>
                  
               </div> :null}
         </div>
      );
   }
}
export default Page;
