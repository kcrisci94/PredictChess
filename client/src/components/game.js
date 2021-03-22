import React from "react";
import "../App.css";
import "./game.css";
import Chessboard from "chessboardjsx";
import Controls from "./controls";
import { ChessInstance, ShortMove } from "chess.js"



class Game extends React.Component {
 
   goToLast = () => {
      var board = this.props.board;
      var currentMove = this.props.currentmove; 
      var history = this.props.history;
      if(board.load(history[history.length-1])){
         console.log("Undid Move");
         var last = board.fen();
         history.pop();
         currentMove = currentMove-1;
         this.props.updateGame(last, currentMove, history, board);
      }
   }


   handleMove = (move: ShortMove) => { 
      var board = this.props.board;
      var history = this.props.history;
      var prev = board.fen(); 
      var current = this.props.currentmove;
      if (board.move(move)) {
         history.push(prev);
         this.props.updateGame(board.fen(), current+1, history, board);
      }
   };
   render() {
      var moves = this.props.moves;
      var moveIndex = this.props.currentmove;  
      var nextMove = moves[moveIndex+1]
      var position = this.props.position; 
      return (
       <div className="flex-center">
         <div>
            <Chessboard
              width={400}
              position={position}
              onDrop={
                 (move) => this.handleMove({from: move.sourceSquare, to: move.targetSquare, promotion: "q"})
              }
            />
            <Controls nextMove={nextMove} nextHandler={this.handleMove} prevHandler={this.goToLast}/> 
	      </div>
      </div>
     );
   }
}
export default Game;
