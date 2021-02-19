import React from "react";
import "../App.css";
import "./game.css";
import Chessboard from "chessboardjsx";
import Controls from "./controls";
import { ChessInstance, ShortMove } from "chess.js"
const {Chess} = require("./chess.js");


class Game extends React.Component {
   constructor() {
      super();
      this.state = {
	  board: {},
	  position: 'start',
	  currentMove: -1,
	  history: []
      };
   }
   componentDidMount() {
      const chess = Chess();
      this.setState({board: chess, position: 'start'});
   }
  
   goToLast = () => {
      var board = this.state.board;
      var currentMove = this.state.currentMove; 
      var history = this.state.history;
      if(board.load(history[history.length-1])){
	 console.log("Undid Move");
	 var last = board.fen();
	 history.pop();
	 currentMove = currentMove-1;
	 this.setState({board: board, currentMove: currentMove, position: last, history: history});
      }
   }


   handleMove = (move: ShortMove) => { 
      var board = this.state.board;
      var history = this.state.history;
      var prev = board.fen(); 
      var current = this.state.currentMove;
      if (board.move(move)) {
	 history.push(prev);
         this.setState({position: board.fen(), board: board, history: history, currentMove: current+1} );
      }
   };
   render() {
      var moves = this.props.moves;
      var moveIndex = this.state.currentMove;  
      var nextMove = moves[moveIndex+1]
      var position = this.state.position; 
      return (
       <div className="flex-center">
	 <div>
            <h1>Random Chess</h1>
            <Chessboard
              width={400}
              position={position}
	      onDrop={(move) => this.handleMove({from: move.sourceSquare, to: move.targetSquare, promotion: "q"})
	      }
            />
	    <Controls nextMove={nextMove} nextHandler={this.handleMove} prevHandler={this.goToLast}/> 
	 </div>
	 <div>
            <p>{this.state.moves}</p>
	 </div>
       </div>
     );
   }
}

export default Game;
