import React from 'react';

//import '../css/signup.css';


/**
 * Signup
 * Rendered By: Body
 * State: firstname, lastname, username
 * Props: handler
 * Renders: signup form
 */
class Signup extends React.Component {

   constructor() {
      super();
      this.state = {
         firstname: "",  //holds entered text for firstname
         lastname: "",   //holds entered text for lastname
         username: ""    //holds entered text for username
      };
   }

  /**
   * Update function
   * updates the state for whichever is being changed
   */
   update = (event) => {
      this.setState({
         [event.target.name] : event.target.value
      });
   }

  /**
   * SubmitUser
   * Tries to insert a new user 
   * If username is not unique, does not create the user
   * Uses MD5 password hashing before sending the password to the server
   * Get info for created user from the server 
   * (id, firstname, lastname, username) and sets this in Page State
   */
   submitUser = () => { 
      fetch('/createUser', {      //Api call create user
         method: 'POST',
         headers: {'Content-Type': 'application/json; charset=utf-8'},
         body: JSON.stringify({
            firstName: this.state.firstname,
            lastName: this.state.lastname,
            username: this.state.username,
            pword: document.getElementById("password").value,
	    chessUname: document.getElementById("chessUname").value
         }),
      })
      .then(res => res.json())
      .then(stats => {
         if(stats){      //If null, then non-unique username entered
            fetch('/checkUser', {
               method: 'POST',
               headers: {'Content-Type': 'application/json; charset=utf-8'},
               body: JSON.stringify({
                  username: this.state.username,
                  pword: document.getElementById("password").value
               }),
            })
            .then(res => res.json())
            .then(stats => {
               if(stats[0]){        //Set the user information in Page state
                  this.props.handler(stats[0]);
               }
            })
            .catch(err => {
               console.log("Error in fetch... ", err)
            });
         }
      })
      .catch(err => {
         document.getElementById("signupError").innerHTML = "An account with this username already exists.";
         console.log("Error in fetch... ", err)
      });
   }

   render() {
      return (
         <div id="signup">
            <h2>Sign Up</h2>
            <div className="flex-vert">
               <label>
                  First Name:
                  <input type='text' id="firstname" name="firstname" 
                     onChange={this.update}/>
               </label>
               <label>
                  Last Name:
                  <input type='text' id="lastname" name="lastname" 
                     onChange={this.update}/>
               </label>
               <label>
                  Username:
                  <input type='text' id="username" name="username" 
                     onChange={this.update}/>
               </label>
	       <label>
                  Chess.com Username:
                  <input type='text' id="chessUname" name="chessUname"/>
               </label>
               <label>
                  Password:
                  <input type='password' id="password" name="password"/>
               </label>
            </div>
            <button type="button" className = "submit btn" 
               onClick={this.submitUser}>Submit</button>
            <p className="response" id="signupError"></p>
         </div>
      );
   }
}

export default Signup;


