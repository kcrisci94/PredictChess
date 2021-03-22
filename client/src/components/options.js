import React, { Component } from 'react';
import './options.css';
class Options extends Component {

    getmygames = () => {
        const data = {
            userID: this.props.userid,
            username: this.props.chess_uname,
         }
         fetch('/getgames', {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify(data),
         }).then(console.log("Downloaded games by " + data.username)).catch(err => {console.log("Error in fetch... ", err)});
            
      
    }

    getOtherGames = () => {
       const data = {
          userID: this.props.userid,
          username: document.getElementById("usersearch").value
       }
       fetch('/getgames', {
         method: 'POST',
         headers: {'Content-Type': 'application/json; charset=utf-8'},
         body: JSON.stringify(data),
      }).then(console.log("Downloaded games by " + data.username)).catch(err => {console.log("Error in fetch... ", err)});
    }

    render() {
        return (
           <div id="options">
              <h2>Options</h2>
              <button type="button" className="getMyGames" onClick={this.getmygames}>Download My Recent Games</button>
              <div>
                  <button type="button" className="getMyGames" onClick={this.getOtherGames}>Download Games By username</button>
                  <input type="text" id="usersearch" placeholder="Enter a chess.com username"/>
              </div>
           </div>
        );
     }
}

export default Options;