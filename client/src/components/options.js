import React, { Component } from 'react';

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

    render() {
        return (
           <div id="options">
              <button type="button" className="getMyGames" onClick={this.getmygames}>Download My Recent Games</button>
              <p>{this.props.chess_uname}</p>
           </div>
        );
     }
}

export default Options;