import React, { Component } from 'react';
//import '../css/login.css';

/**
 * Login
 * Rendered By: Body
 * State: none
 * Props: handleChange, toSignup
 * Renders: login form
 */
class Login extends Component {

 /**
  * Method to first check if the user exists with the login/password entered
  * If no user is found, will not log in (displays 'incorrect credentials')
  * Sends MD5 hashed password to server
  */
   checkUser = () => {
      fetch('/checkUser', {
         method: 'POST',
         headers: {'Content-Type': 'application/json; charset=utf-8'},
         body: JSON.stringify({
            username: document.getElementById("uname").value,
            pword: document.getElementById("pword").value
         }),
      })
      .then(res => res.json())
      .then(stats => {
         if(stats[0]){
            console.log("Logged in as", stats[0].firstName, stats[0].lastName);
            this.props.handleChange(stats[0]); //change user in Page
         }else{
            let message = "incorrect credentials, try again"
            document.getElementById("error").innerHTML = message;
            console.log("Incorrect Credentials");
         }
      })
      .catch(err => {console.log("Error in fetch... ", err)});
   }
 
   render() {
      return (
         <div id="login">
            <h1>Login</h1>
            <div className="flex-vert">
               <div>
                  <label>
                     Username:
                     <input type='text' id="uname" name='username'/>
                  </label>
                  <br />
                  <label>
                     Password:
                     <input type='password' id="pword" name='password'/>
                  </label>
               </div>
               <div className="flex">
                  <button type="button" className="btn" onClick={this.props.toSignup}>Sign Up</button>
                  <button type="button" className="btn" onClick={this.checkUser}>Login</button>
               </div>
               <p id="error"></p>
            </div>
         </div>
      );
   }
}

export default Login;

