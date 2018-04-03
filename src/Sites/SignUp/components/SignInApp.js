import React from "react";

export default class SignInApp extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: ""
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
        this.addLinkToHead("./../style/signin.css");
    }

    handleClick() {
        const thiz = this;
        fetch("https://localhost:8080/users/signIn", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(
                {
                    username: this.state.username,
                    password: this.state.password
                }
            )
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            console.log(response);
        });
    }

    reassignUsername(evt) {
        this.setState({username: evt.target.value});
    }

    reassignPassword(evt) {
        this.setState({password: evt.target.value});
    }

    render() {
        return (
            <div id="main-content">
                <h1>Sign In</h1>
                <input type="text" placeholder="Account Name" onChange={this.reassignUsername.bind(this)}/>
                <br/>
                <input type="password" placeholder="Password" onChange={this.reassignPassword.bind(this)}/>
                <br/>
                <button className="btn btn-primary" type="submit" onClick={this.handleClick.bind(this)}>Sign In</button>
            </div>
        );
    }

}
