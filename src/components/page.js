import React, { Component } from 'react';
import Game from './game';

/**
 * Page
 * Rendered By: App.js
 */
class Page extends Component {
   render() {
      return (
         <div id="board">
            <h1>ChessBoard</h1>
            <Game />
	 </div>
      );
   }
}

export default Page;
