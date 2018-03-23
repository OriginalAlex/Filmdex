import React from "react";

import FilmHeader from "./../../GlobalComponents/Header.js";
import LoadingScreen from "./../../GlobalComponents/LoadingScreen";
import CastCarousel from "./../../GlobalComponents/CastCarousel";
import Reviews from "./../../GlobalComponents/Reviews";

export default class MoviesApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "movieId": props.match.params.id,
            "movieData": {}
        }
        this.monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
        this.iso = {"ar":"Arabic","hy":"Armenian","zh":"Chinese","cs":"Czech","da":"Danish","nl":"Dutch","en":"English","eo":"Esperanto","fi":"Finnish","fr":"French","ka":"Georgian","de":"German","el":"Greek","it":"Italian","ja":"Japanese","ko":"Korean","ku":"Kurdish","fa":"Persian","pl":"Polish","pt":"Portugese","ro":"Romanian","ru":"Russian","es":"Spanish","sv":"Swedish","tr":"Turkish","ur":"Urdu"}
    }

    addLinkToHead(href) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = href;
        document.head.appendChild(link);
    }

    addScriptToHead(src) {
        const script = document.createElement("script");
        script.src = src;
        document.body.appendChild(script);
    }

    makeAPICall() {
        const thiz = this;
        fetch("http://localhost:8080/films/" + this.state.movieId)
        .then(results => results.json())
        .then(data => {
            thiz.setState({"movieData": data});
            document.title = data.title;
            var cast = data.credits.cast, crew = data.credits.crew, starArray = [], directors = [], producers = [];
            if (cast != null) {
                for (var i = 0; i < 12 && i < cast.length; i++) {
                    starArray.push({
                        name: cast[i].name,
                        characterName: cast[i].character,
                        picture: cast[i].profile_path,
                        id: cast[i].id
                    });
                }
            }
            if (crew != null) {
                for (var j = 0; j < crew.length; j++) {
                    var crewMember = crew[j];
                    if (crewMember.job.valueOf() === "Producer") {
                        producers.push(crewMember.name);
                    } else if (crewMember.job === "Director") {
                        directors.push(crewMember.name);
                    }
                }
            }
            thiz.setState({
                "mainActors": starArray,
                "directors": directors,
                "producers": producers
            });
        });
    }

    componentWillMount() {
        this.addLinkToHead("./../style/movies.css");
        this.addLinkToHead("./../slick/slick.css");
        this.addLinkToHead("./../slick/slick-theme.css");
        this.addScriptToHead("./../slick/slick.min2.js");
    }

    componentDidMount() {
        this.makeAPICall();
    }

    createCrewList(role, array) {
        if (array == null || array.length === 0) return "";
        return <div className="staff" id={role}><h4>{role}{(array != null && array.length>1) ? "s" : ""}:</h4>
            <ul className="crew-list">{array.map((crewMember) =>
                <li key={crewMember}>
                    {crewMember}
                </li>)}
            </ul>
        </div>
    }

    createActorList(role, array) {
        if (array == null || array.length === 0) return "";
        return <div className="staff" id={role}><h4>{role}{(array != null && array.length>1) ? "s" : ""}:</h4>
            <ul className="crew-list">{array.map((crewMember) =>
                <li key={crewMember.name}>
                    <b>{crewMember.name}</b> - {crewMember.role}
                </li>)}
            </ul>
        </div>
    }

    getGenres() {
        var genres = this.state.movieData.genres;
        if (genres == null || genres.length === 0) return "";
        if (genres.length===1) return genres[0].name;
        return genres[0].name + ", " + genres[1].name;
    }

    getBackdropImage() {
        var path = this.state.movieData.backdrop_path;
        if (path == null) return "";
        return <img id="backdropImg" src={"https://image.tmdb.org/t/p/w780/" + path} alt="Backdrop"/>
    }

    getReadableDate(date) { // dates are of the form yyyy-mm-dd
        if (date == null) return "";
        var parts = date.split("-");
        return <span className="date">{parts[2]} {this.monthNames[parseInt(parts[1], 10)-1]} {parts[0]}</span>
    }

    populateVideos() {
        var videosObj = this.state.movieData.videos;
        if (videosObj == null) return "";
        var videos = videosObj.results, elements = [];
        for (var i = 0; i < videos.length && elements.length <= 3; i++) {
            var video = videos[i];
            if (video.site === "YouTube") {
                elements.push(<div key={video.id} className="video"><iframe width="100%" height="auto" src={"https://www.youtube.com/embed/" + video.key} title="Movie Clip" allowFullScreen/></div>);
            }
        }
        return elements;
    }

    render() {
        var movieData = this.state.movieData;
        if (Object.keys(movieData).length === 0 && movieData.constructor === Object) { // if movieData is an empty object
            return (
                <LoadingScreen/>
            );
       }
        return (
            <div id="main-content">
                <div id="main-content-left" className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div id="basic-info">
                        <FilmHeader title={movieData.title} rating={movieData.vote_average} release={movieData.release_date}/>
                        <div id="movie-details">
                            <p id="details" className="float-left">{(movieData.runtime !== 0) ? movieData.runtime : "?"}m&nbsp;&nbsp;|&nbsp;&nbsp;{this.iso[movieData.original_language]}&nbsp;&nbsp;|&nbsp;&nbsp;{this.getReadableDate(movieData.release_date)}</p>
                            <p id="genres" className="float-right">{this.getGenres()}</p>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <div id="filmInfo" className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                        {this.getBackdropImage()}
                        <div id="textualInfo">
                            <p id="description">{movieData.overview}</p>
                            <hr/>
                            {this.createCrewList("Director", this.state.directors)}
                            {this.createCrewList("Producer", this.state.producers)}
                        </div>
                        <hr className="pad"/>
                        <h1 id="main-actors" className="important-title">Main Actors</h1>
                        <CastCarousel cast={this.state.mainActors}/>
                        <hr className="pad"/>
                        <h1 className="important-title">Reviews</h1>
                        <Reviews reviews={movieData.reviews}/>
                        <hr className="pad"/>
                    </div>
                    <div id="videos" className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                        <h1>Featured Videos:</h1>
                        <div id="videoList" className="fancy-scrollbar">
                            {this.populateVideos()}
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
}
