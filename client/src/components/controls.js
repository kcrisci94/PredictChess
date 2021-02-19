import React from "react";
import "./controls.css";
import leftarrow from "../LeftArrow.png";
import rightarrow from "../RightArrow.png";
class Controls extends React.Component {
   render() {
      var nextMove = this.props.nextMove;  
      return (
       <div>
          <img className="arrow" onClick={this.props.prevHandler} src={leftarrow} alt="left_arrow"/>
	  <img className="arrow" onClick={() => this.props.nextHandler(nextMove)} src={rightarrow} alt="right_arrow"/>
       </div>
     );
   }
}

export default Controls;
