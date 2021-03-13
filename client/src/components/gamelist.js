import React from "react";
import "../App.css";

class Gamelist extends React.Component {
   constructor() {
      super();
      this.state = {
//	 game: [],
	alllist: [],
	display: []
      };
   }
   componentDidMount() {
      fetch('/games/mygames', {
         method: 'GET',
         headers: {'Content-Type': 'application/json; charset=utf-8'},
      })
      .then(res => res.json())
      .then(stats => {
//	 var re = /\. (O-O|[A-R][a-h][1-8][a-h][1-8]|[a-h][1-8]\=[A-R]|[a-h][1-8]|[A-R][a-h][1-8]|[A-R][a-h][a-h][1-8]|[A-R][1-8][a-h][1-8]|[a-h]x[a-h][1-8]|[A-R]x[a-h][1-8]|[A-R][a-h]x[a-h][1-8])\+?/g;
//	 var array = [];
//         stats[1].pgn.replace(re, (s, match) => {array.push(s.substr(2));}); 
//         console.log(array);
         this.setState({alllist: stats });
      })
      .catch(err => {console.log("Error in fetch... ", err)});

   }
 
   getMoves(pgn) {
      var re = /\. (O-O|[A-R][a-h][1-8][a-h][1-8]|[a-h][1-8]\=[A-R]|[a-h][1-8]|[A-R][a-h][1-8]|[A-R][a-h][a-h][1-8]|[A-R][1-8][a-h][1-8]|[a-h]x[a-h][1-8]|[A-R]x[a-h][1-8]|[A-R][a-h]x[a-h][1-8])\+?/g;
      var array = [];
      pgn.replace(re, (s, match) => {array.push(s.substr(2));});
//      this.setState({game: array});
      return array;
   }
   
   render() {
      var j, list;
      var topgames = [];
      list = this.state.alllist;
      for(j=list.length-1; j>list.length-11; j--){
         topgames.push(list[j]);
      }
      return (
       <div className="flex-center">
          <ul>
	     {topgames.map((moves, index) =>
                <li key={index}><a onClick={() => {this.props.startGame(this.getMoves(topgames[index].pgn));}}>Game{index}</a></li>
             )}
	  </ul>
       </div>
     );
   }
}

export default Gamelist;
