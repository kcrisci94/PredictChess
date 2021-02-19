import React from "react";
import "../App.css";

class Gamelist extends React.Component {
   constructor() {
      super();
      this.state = {
	 game: [],
      };
   }
   componentDidMount() {
      var game = ["e4", "e5", "c3", "Nf6", "f3", "d5", "Qe2", "dxe4", "fxe4", "Bc5"]
      this.setState({game: game });
   }
  
   
   render() {
      return (
       <div className="flex-center">
          <ul>
             <li><a onClick={() => this.props.startGame(this.state.game)}>Game1</a></li>
	  </ul>
       </div>
     );
   }
}

export default Gamelist;
