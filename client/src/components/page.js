import React, { Component } from 'react';
import Game from './game';
import Gamelist from './gamelist';

/**
 * Page
 * Rendered By: App.js
 */
class Page extends Component {
   constructor() {
      super();
      this.state = {
         moves: []
      };
   }
   startGame = (moves) => {
      this.setState({moves: moves});
   }
   render() {
      return (
         <div id="board">
            <h1>ChessBoard</h1>
            <Game moves={this.state.moves}/>
	    <Gamelist startGame={this.startGame}/>
	 </div>
      );
   }
}

export default Page;
