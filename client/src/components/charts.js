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
      </div>
     );
   }
}

export default Controls;
