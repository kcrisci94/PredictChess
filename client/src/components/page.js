import React, { Component } from 'react';

import Game from './game';
import Gamelist from './gamelist';
import Login from './login';
import Signup from './signup';
import Options from './options';
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
         history: []
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
   }

   toSignup = () => {
      this.setState({
         title: "SignUp"
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
                  <Game updateGame={this.updateGame} position={this.state.position} moves={this.state.moves} 
                        currentmove={this.state.current} history={this.state.history} board={this.state.board}/>
                  {<Options chess_uname={this.state.userInfo.chessUsername}/> }
                  <div className='moves'>
                     <p>{this.state.moves.join(" ")}</p>
                  </div>
                  <Gamelist startGame={this.startGame} username={this.state.userInfo.chessUsername}/></div> :null}
               </div>
      );
   }
}
export default Page;
