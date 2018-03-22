import React from "react";

import "./Loading.css";

export default class LoadingScreen extends React.Component {
    render() {
        return (
            <div id="animation-container">
                <h1>Loading...</h1>
                <div className="spinner">
                    <div className="cube1"></div>
                    <div className="cube2"></div>
                </div>
            </div>
        )
    }
}
