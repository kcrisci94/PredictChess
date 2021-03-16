import React from "react";
import "../App.css";
import "./gamelist.css";

class Gamelist extends React.Component {
   constructor() {
      super();
      this.state = {
//         game: [],
         alllist: [],
         display: []
      };
   }
   componentDidMount() {
      fetch('/games/mygames', {
         method: 'POST',
         headers: {'Content-Type': 'application/json; charset=utf-8'},
         body: JSON.stringify({username: this.props.username})
      })
      .then(res => res.json())
      .then(stats => {
         this.setState({alllist: stats });
      })
      .catch(err => {console.log("Error in fetch... ", err)});

   }
   
   render() {
      var j, list;
      var topgames = [];
      list = this.state.alllist;
      for(j=list.length-1; j>list.length-11; j--){
         topgames.push(list[j]);
      }
      console.log(topgames)
      return (
       <div className="lists">
          <table>
            <thead>
               <tr><th>White Player</th><th>Black Player</th><th>Date Played</th></tr>
            </thead>
            <tbody>
	     {topgames[0] ? topgames.map((item, index) => 
                <tr key={index} onClick={() => {
                   this.props.startGame(item.moves.split(" "));}}>
                   <td>
                        {item.whiteName}
                   </td>
                   <td>
                        {item.blackName}
                   </td>
                   <td>
                        {item.datePlayed}
                   </td>
                </tr>
             ) : null}
             </tbody>
          </table>
       </div>
     );
   }
}

export default Gamelist;
