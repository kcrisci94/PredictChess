import React, { Component } from 'react';
import Game from './game';
import Gamelist from './gamelist';
import Login from './login';
import Signup from './signup';
import Options from './options';

/**
 * Page
 * Rendered By: App.js
 */
class Page extends Component {
   constructor() {
      super();
      this.state = {
         title: 'Login',
         userInfo: {}, 
         moves: []
      };
   }
   startGame = (moves) => {
      this.setState({moves: moves});
   }
   
   editUser = (stats) => {
      console.log(stats)
      this.setState({
         userInfo: stats,
         title: "Game",
      });
   }

   toSignup = () => {
      this.setState({
         title: "SignUp"
      });
   }
   
   render() {
      return (
         <div id="board">
            <h1>Predict Chess</h1>
            {this.state.title === 'Login' ? 
            <Login handleChange={this.editUser} 
               toSignup={this.toSignup}/> : null}

            {this.state.title === "SignUp" ? <Signup
                  handler={this.editUser}/> : null}

            {this.state.title === 'Game' ?
                  <div>
                     <Game moves={this.state.moves}/>
                     {<Options chess_uname={this.state.userInfo.chessUsername}/> }
               <Gamelist startGame={this.startGame}/></div> :null}
         </div>
      );
   }
}
export default Page;
