import React from "react";
import CanvasJSReact from './canvasjs.react';
import './charts.css';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const HeatMap = require('react-heatmap-grid').default;

class Controls extends React.Component {
   
   componentDidMount(){
      fetch('/get_prediction', {
         method: 'POST',
         headers: {'Content-Type': 'application/json; charset=utf-8'},
         body: JSON.stringify({username: this.props.chessUsername})})
         .then(res => console.log(res))
   }
   top3Pieces = () => {
      let length = this.props.chart1.data[0].dataPoints.length;
      let options = this.props.chart1.data[0].dataPoints.slice(length - 3, length);
      return options.reverse();
   }

   render() {
      var options = this.props.chart1;  
      let topCaptures = this.top3Pieces();
      let yLabels = ["8", "7", "6", "5", "4", "3", "2", "1"];
      let xLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];
      let data = this.props.squaresTaken;
      console.log(data);
      let data2 = this.props.squaresToTake;
      return (
      <div className="flex-horiz">
         <div className="chart1">
            <CanvasJSChart className="chartDisplay"
               options={options}
               // onRef = {ref => this.chart = ref}
            />
            <div className="results">
               <p>The Player's Top 3 Capturing Pieces are:</p>
               <ul>
               {topCaptures.map((item, index) => 
                  <li key={index} onClick={() => {this.props.updateDisplay(item.added_user);}}>
                     {item.label}: {item.y}
                  </li>
               )}       
               </ul>
               <p>
                  Try to take them out early, or block them with other pieces.
               </p>
            </div>
         </div>
         <div className="chart2">
            <h2>Where Player Loses Pieces</h2>
            <HeatMap xLabels={xLabels} yLabels={yLabels} data={data} squares={true}/>
         </div>
         <div className="chart3">
            <h2>Where Player Takes Pieces</h2>
            <HeatMap xLabels={xLabels} yLabels={yLabels} data={data2} squares={true}/>
         </div>
      </div>
     );
   }
}

export default Controls;
