import React, {Component} from 'react';
import FilmCarousel from './FilmCarousel';
import UpcomingFilms from './UpcomingFilms';
import CloseCinemas from './CloseCinemas';

import LoadingScreen from "./../../GlobalComponents/LoadingScreen";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            "data": []
        }
    }

    makeAPICall() {
        const thiz = this;
        fetch("http://localhost:8080/basicInfo")
        .then(results => results.json())
        .then(data => {
            var results = data.popularReleases.results, requiredInfo = [], upcoming = data.upcomingReleases.results, upcomingArr = [];
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                requiredInfo.push({
                    "title": result.title,
                    "id": result.id,
                    "description": result.overview,
                    "scoreOutOfTen": result.vote_average,
                    "poster": ("https://image.tmdb.org/t/p/w185/" + result.poster_path)
                });
            }
            for (i = 0; i < 5 && i < upcoming.length; i++) {
                var film = upcoming[i];
                upcomingArr.push({
                    "title": film.title,
                    "premiere": film.release_date,
                    "id": film.id
                });
            }
            thiz.setState({"data": requiredInfo, "upcoming": upcomingArr});
        });
    }

    addLinkToHead(href) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = href;
        document.head.appendChild(link);
    }

    addSlickToBody() {
        var slickCode = document.createElement("script");
        slickCode.type = "text/javascript";
        slickCode.src = "slick/slick.min.js";
        slickCode.id = "slick";
        document.body.appendChild(slickCode);
    }

    componentDidMount() {
        this.makeAPICall();
    }

    componentWillMount() {
        this.addLinkToHead("slick/slick.css");
        this.addLinkToHead("slick/slick-theme.css");
        this.addLinkToHead("style/home.css");
        this.addSlickToBody();
    }

    render() {
        if (this.state.data.length === 0) {
            return (<LoadingScreen/>);
        }
        return (
            <div id="main-content">
                <div id="main-content-left" className="col-lg-8 col-md-9 col-sm-9 col-xs-12">
                    <div id="carousel-stuff">
                        <h1>Recent Releases</h1>
                        <FilmCarousel films={this.state.data}/>
                    </div>
                    <hr/>
                    <div className="article">
                        <h2 className="header">Lorem ipsum</h2>
                    </div>
                </div>
                <div id="main-content-right" className="col-lg-4 col-md-3 col-sm-3 col-xs-12">
                    <UpcomingFilms upcoming={this.state.upcoming}/>
                    <CloseCinemas />
                </div>
                <div className="clearfix"/>
            </div>
        );
    }
}
