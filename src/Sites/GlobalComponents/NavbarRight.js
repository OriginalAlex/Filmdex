import React , {Component} from 'react';

export default class NavbarRight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "-1"
        }
    }

    render() {
      console.log(this.state.username);
        if (this.state.username !== "-1") {
            return (
                <ul className="nav navbar-nav navbar-right">
                    <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span className="glyphicon glyphicon-bell notification show-count" data-count="2"></span></a>
                            <ul className="dropdown-menu">
                                <li><a href="#">Notification!</a></li>
                            </ul>
                    </li>
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span className="glyphicon glyphicon-user"/> &nbsp;{this.state.username} <span className="caret"></span></a>
                        <ul className="dropdown-menu">
                            <li><a>Signed in as: <b>{this.state.username}</b></a></li>
                            <li role="separator" className="divider"></li>
                            <li><a href="#"><span className="glyphicon glyphicon-wrench"/> Account Settings</a></li>
                            <li><a href="#"><span className="glyphicon glyphicon-heart"/>&nbsp;&nbsp;My Watch List</a></li>
                            <li><a href="#"><span className="glyphicon glyphicon-pencil"/>&nbsp;&nbsp;Write a Post</a></li>
                            <li role="separator" className="divider"></li>
                            <li><a href="#" onClick={this.signOut}><span className="
glyphicon glyphicon-log-out"/>&nbsp;&nbsp;Sign out</a></li>
                            <li role="link-seperator" className="divider visible-xs"></li>
                        </ul>
                    </li>
                </ul>
            );
        } else {
            return(
                <ul className="nav navbar-nav navbar-right mr-auto">
                    <li className="navbar-form-container">
                        <button id="signIn" className="bttn bttn-green navbar-btn" onClick={this.signUpPage}>Sign Up</button>
                        <button className="bttn bttn-blue navbar-btn" onClick={this.logInPage}>Log In</button>
                        <div className="clearfix"></div>
                    </li>
                </ul>
            );
        }
    }

    signUpPage() {
      window.location.replace("/register");
    }

    logInPage() {
      window.location.replace("login");
    }

    componentWillReceiveProps(props) {
      this.setState({username: props.username});
    }

    signOut() {
      console.log("hi");
      fetch("https://localhost:8080/users/signOutNow", {
          method: "POST",
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
          },
          credentials: 'include',
      })
    }

}
