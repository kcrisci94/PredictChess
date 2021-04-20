import React from "react";
import CanvasJSReact from './canvasjs.react';
import './charts.css';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Controls extends React.Component {
   render() {
      var options = this.props.chart1;  
      return (
        <div className="chart1">
        <CanvasJSChart
          options={options}
          // onRef = {ref => this.chart = ref}
        />
        <div className="results">
           <p>The Player's Top 3 Capturing Pieces are: 
           <ul>
               {topCaptures.map((item, index) => 
                  <li key={index} onClick={() => {this.props.updateDisplay(item.added_user);}}>
                     {item.label}: {item.y}
                  </li>
               )}       
           </ul>
           Try to take them out early, or block them with other pieces.
           </p>
        </div>
      </div>
     );
   }
}

export default Controls;
