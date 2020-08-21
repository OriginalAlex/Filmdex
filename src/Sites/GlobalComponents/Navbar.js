import React, {Component} from 'react';
import NavbarRight from './NavbarRight';
import './Navbar.css'

export default class Navbar extends Component {

    constructor(props) {
        super(props);
        this.checkSignIn();
        this.state = {
            "signedIn": "false"
        };

    }

    search() {
        if (this.query == null || this.query === "") return;
        window.location.href = ("/search/" + this.query);
    }

    handleChange(event) {
        this.query = event.target.value;
    }

    keyUp(event) {
        if (event.keyCode === 13) {
            this.search();
        }
    }

    render() {
        return (
            <nav id="navbar" className="navbar navbar-inverse">
            	<div className="container">
            		<div className="navbar-header">
            			<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            			<span className="sr-only">Toggle navigation</span>
            			<span className="icon-bar"></span>
            			<span className="icon-bar"></span>
            			<span className="icon-bar"></span>
            			</button>
            			<a className="navbar-brand" href="/"><span className="glyphicon glyphicon-camera hidden-xs"></span> Filmdex</a>
            		</div>
                    <div id="nav-items">
                		<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                			<ul id="navbar-content" className="nav navbar-nav">
                				<li><a href="#"><span className="glyphicon glyphicon-fire hidden-xs"></span><span className="hidden-xs"> </span>What&apos;s hot&nbsp;<span className="glyphicon glyphicon-fire visible-xs"></span></a></li>
                				<li className="dropdown">
                					<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Top Films <span className="caret"/></a>
                					<ul className="dropdown-menu">
                						<li><a href="#">iMDB Top</a></li>
                						<li><a href="#">Our Top</a></li>
                                        <li><a href="#">Recent Releases</a></li>
                						<li role="separator" className="divider"></li>
                						<li><a href="#">Community Recommendations</a></li>
                                        <li role="separator" className="divider visible-xs"></li>
                					</ul>
                				</li>
                                <div className="navbar-form-container">
                					<input id="search" type="text" onKeyUp={this.keyUp.bind(this)} className="form-control" onChange={this.handleChange.bind(this)} placeholder="Discover Films, TV Shows, and more..."/>
                                    <button id="search-btn" type="submit" onClick={this.search.bind(this)} className="btn btn-default navbar-btn"><span className="glyphicon glyphicon-search"/></button>
                                </div>
                			</ul>
                			<NavbarRight isSignedIn={this.state.signedIn}/>
                		</div>
                    </div>
            	</div>
            </nav>
        );
    }

    checkSignIn() {
      fetch("https://localhost:8080/checkSignedIn/", {
          method: "GET",
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
          },
          credentials: 'include',
      })
      .then(result => result.text())
      .then(result => {
        if (result === "yes") {
          this.setState({signedIn: "true"});
        } else{
          this.setState({signedIn: "false"});
        }
      })
    }

}
