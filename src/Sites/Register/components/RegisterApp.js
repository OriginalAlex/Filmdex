import React from "react";

export default class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            email: "",
            results: [],
            registered: false
        }
    }

    addLinkToHead(href) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = href;
        document.head.appendChild(link);
    }

    componentWillMount() {
        this.addLinkToHead("./../style/register.css");
    }

    handleClick() {
      console.log(this.state);
        const thiz = this;
        fetch("https://127.0.0.1:8080/users/create", {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(
                {
                    username: this.state.username,
                    password: this.state.password,
                    email: this.state.email
                }
            )
        })
        .then(function(response) {
          console.log(response);
            if (response.status == 201) {
                thiz.setState({registered: true});
            } else {
                thiz.setState({registered: false});
            }
            return response.json();
        })
        .then(response => {
            console.log(response.results);
            response.results.sort(function(a, b) { // sort lexicographically to avoid "jumpy" behaviour
                return a.localeCompare(b);
            });
            thiz.setState(
                {
                    results: response.results
                }
            );
        });
    }

    reassignUsername(event) {
        this.setState({username: event.target.value});
    }

    reassignPassword(event) {
        this.setState({password: event.target.value});
    }

    reassignEmail(event) {
        this.setState({email: event.target.value});
    }

    getStatusStyle() {
        console.log(this.state.registered);
        if (this.state.registered) {
            return {"color": "green"}
        } else {
            return {"color": "red"}
        }
    }

    getStatus() {
        const results = this.state.results, elementArray = [];
        if (results == null || results.length === 0) return (
            <div id="status-container">
                <li>Pending...</li>
            </div>
        );
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            elementArray.push(
                <li className="status" key={i}>
                    {result}
                </li>
            );
        }
        return (
            <div id="status-container" style={this.getStatusStyle()}>
                {elementArray}
            </div>
        );
    }

    render() {
        return (
            <div id="main-content">
                <h1>Register Users</h1>
                <input type="text" placeholder="Account Name" onChange={this.reassignUsername.bind(this)}/>
                <br/>
                <input type="password" placeholder="Password" onChange={this.reassignPassword.bind(this)}/>
                <br/>
                <input type="email" placeholder="Email" onChange={this.reassignEmail.bind(this)}/>
                <br/>
                <button className="btn btn-primary" type="submit" onClick={this.handleClick.bind(this)}>Register</button>
                <h2>Registration Status</h2>
                <div className="errors">
                    <ul>
                        {this.getStatus()}
                    </ul>
                </div>
            </div>
        );
    }
}
