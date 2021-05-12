
import React from "react";
import "../App.css";
import "./model.css";

class Model extends React.Component {
    constructor() {
        super();
        this.state = {
           predictedOpening: '', 
           modelAccuracy: 0
        };
    }

    getOpenings = (color) => {  
         fetch('/get_prediction', {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify({myuname: this.props.me, oppuname: this.props.analyzeUser, color: color})
         }).then(res => res.json()).then(res => JSON.parse(res.replace(/'/g, '"')))
         .then(res => this.setState({predictedOpening: res["Predicted Opening"], modelAccuracy: res["Accuracy"]}));
    }
    changeColor = (event) => {
        let s = event.target.value;
        if(s == 'White'){
           this.getOpenings('White');
        }else if(s == 'Black'){
            this.getOpenings('Black');
        }
    }

    resetModel = () =>{
        this.setState({predictedOpening: '', modelAccuracy: 0});
    }
    render() {
        return (
           <div id="model">
              <h2>Predict Best Opening VS Opponent</h2>
              <div id="colorSelect" onChange={this.changeColor}>
                    <input type="radio" value="White" name="color" /> White
                    <input type="radio" value="Black" name="color" /> Black
              </div>
              <div>
                 {(this.state.predictedOpening != '') ? <div><p>Best Opening to Try: {this.state.predictedOpening}</p> <p>Model Accuracy: {this.state.modelAccuracy}</p>
                 <button type="button" className="btn" onClick={this.resetModel}>Clear Model Results</button></div> : null}
              </div>
           </div>
        );
     }
}
export default Model;