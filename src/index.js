import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import {Switch, BrowserRouter, Route} from "react-router-dom";

import Navbar from "./Sites/GlobalComponents/Navbar";
import HomeApp from "./Sites/Home/components/HomeApp";
import MoviesApp from "./Sites/Movies/components/MoviesApp";
import ShowsApp from './Sites/Shows/components/ShowsApp.js';
import SearchApp from "./Sites/Search/components/SearchApp";
import RegisterApp from "./Sites/Register/components/RegisterApp";
import SignInApp from "./Sites/SignUp/components/SignInApp";

class EntireApp extends React.Component {
    render() {
        return (
            <div>
                <Navbar/>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={HomeApp}/>
                        <Route exact path=" /home" component={HomeApp}/>
                        <Route exact path="/movies/:id" component={MoviesApp}/>
                        <Route exact path="/shows/:id" component={ShowsApp}/>
                        <Route exact path="/search/:query" component={SearchApp}/>
                        <Route exact path="/register" component={RegisterApp}/>
                        <Route exact path="/login" component={SignInApp}/>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

ReactDOM.render(<EntireApp />, document.getElementById("root"));
registerServiceWorker();
