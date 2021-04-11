import React from "react";
import "../App.css";
import "./gamelist.css";

class Gamelist extends React.Component {
   
   render() {
      let list;
      list = this.props.display;
      return (
       <div className="lists">
          <table>
            <thead>
               <tr><th>White Player</th><th>Black Player</th><th>Date Played</th><th>Winner</th></tr>
            </thead>
            <tbody>
	     {list[0] ? list.map((item, index) => 
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
                   <td> 
                        {item.winner}
                   </td>
                </tr>
             ) : null}
             </tbody>
          </table>
          <button type="button" className="getMyGames" onClick={this.props.getmygames}>Refresh My Games</button>
       </div>
     );
   }
}

export default Gamelist;
