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
      fetch('/games/mygames', {
         method: 'GET',
         headers: {'Content-Type': 'application/json; charset=utf-8'},
      })
      .then(res => res.json())
      .then(stats => {
         console.log(stats);
        //this.setState({game: game });
      })
      .catch(err => {console.log("Error in fetch... ", err)});

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
