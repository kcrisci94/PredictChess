import React, { Component } from 'react';

class SelectDisplay extends Component {
    constructor() {
        super();
        this.state = {
           userlist: []        
        };
    }
    componentDidMount() {
        fetch('/getAddedUsers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify({
               userid: this.props.userid
            }),
        }).then(res => res.json()).then(res => this.setState({userlist: res}))
     }

    render() {
        let list = this.state.userlist;
        return (
            <div>
                <h2>Added Users</h2>
                <ul>
                    {list[0] ? list.map((item, index) => 
                    <li key={index} onClick={() => {this.props.updateDisplay(item.added_user);}}>
                    {item.added_user}
                    </li>
                ) : null}
                </ul>
            </div>
        );
    }
}

export default SelectDisplay;