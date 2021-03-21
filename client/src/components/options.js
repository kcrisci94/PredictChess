import React, { Component } from 'react';
import './options.css';
class Options extends Component {

    getmygames = () => {
        const data = {
            username: this.props.chess_uname,
         }
         fetch('/getgames', {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify(data),
         })
    }

    getOtherGames = () => {
       const data = {
          username: document.getElementById("usersearch").value
       }
       fetch('/getgames', {
         method: 'POST',
         headers: {'Content-Type': 'application/json; charset=utf-8'},
         body: JSON.stringify(data),
      })
    }

    render() {
        return (
           <div id="options">
              <button type="button" className="getMyGames" onClick={this.getmygames}>Download My Recent Games</button>
              <button type="button" className="getMyGames" onClick={this.getOtherGames}>Download Games By username</button>
              <input type="text" id="usersearch" value="Enter a chess.com username"/>
           </div>
        );
     }
}

export default Options;