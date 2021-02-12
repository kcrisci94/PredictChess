import React from "react";
import "../App.css";
import Chessboard from "chessboardjsx";
import { ChessInstance, ShortMove } from "chess.js"
const {Chess} = require("./chess.js");


class Game extends React.Component {
   constructor() {
      super();
      this.state = {
	  board: {},
	  position: 'start',
	  moves: []
      };
   }
   componentDidMount() {
      const chess = Chess();
      this.setState({board: chess, position: 'start', moves: this.props.moves});
   }
  
   handleMove = (move: ShortMove) => { 
      var board = this.state.board;
    if (board.move(move)) {
      this.setState({position: board.fen(), board: board} );
    }
  };
   render() {
      return (
       <div className="flex-center">
         <h1>Random Chess</h1>
         <Chessboard
           width={400}
           position={this.state.position}
	   onDrop={(move) => this.handleMove({from: move.sourceSquare, to: move.targetSquare, promotion: "q"})
	   }
         />
	 <div>
            <p>{this.props.moves}</p>
	 </div>
       </div>
     );
   }
}

export default Game;
