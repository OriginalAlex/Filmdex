import React from "react";

import ShowHeader from "./../../GlobalComponents/Header.js";
import LoadingScreen from "./../../GlobalComponents/LoadingScreen";
import CastCarousel from "./../../GlobalComponents/CastCarousel";
import Reviews from "./../../GlobalComponents/Reviews";
import CommentBox from "./../../GlobalComponents/CommentBox";

export default class ShowsApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: props.match.params.id,
            showData: {},
            comments: []
        }
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

    componentWillMount() {
        this.addLinkToHead("./../style/shows.css");
        this.addLinkToHead("./../style/MoviesAndShows.css");
        this.addLinkToHead("./../slick/slick.css");
        this.addLinkToHead("./../slick/slick-theme.css");
        this.addScriptToHead("./../slick/slick.min2.js");
    }

    makeAPICall() {
        const thiz = this;
        fetch("https://localhost:8080/shows/" + this.state.query)
        .then(results => results.json())
        .then(data => {
            thiz.setState({"showData": data});
            console.log(data);
            document.title = data.name;
            var cast = data.credits.cast, crew = data.credits.crew, starArray = [], directors = [], producers = [];
            if (cast != null) {
                for (var i = 0; i < 15 && i < cast.length; i++) {
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
            console.log(thiz.state);
        });
        fetch("https://localhost:8080/users/fetchPostsByThread?thread=t-" + this.state.query)
        .then(results => results.json())
        .then(results => {
            thiz.setState({
                "comments": results
            });
        });
    }

    componentDidMount() {
        this.makeAPICall();
    }

    getReadableDate(date) { // dates are of the form yyyy-mm-dd
        if (date == null) return "";
        var parts = date.split("-");
        return <span className="date">{parts[2]} {this.monthNames[parseInt(parts[1], 10)-1]} {parts[0]}</span>
    }

    getGenres() {
        var genres = this.state.showData.genres;
        if (genres == null || genres.length === 0) return "";
        if (genres.length===1) return genres[0].name;
        return genres[0].name + ", " + genres[1].name;
    }

    getBackdropImage() {
        var path = this.state.showData.backdrop_path;
        if (path == null) return "";
        return <img id="backdropImg" src={"https://image.tmdb.org/t/p/w780/" + path} alt="Backdrop"/>
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

    getCastCarousel() {
        if (this.state.mainActors != null && this.state.mainActors.length !== 0) {
            return (
                <div>
                    <h1 id="main-actors" className="important-title">Main Actors</h1>
                    <CastCarousel cast={this.state.mainActors}/>
                    <hr/>
                </div>
            );
        }
    }

    populateVideos() {
        var videosObj = this.state.showData.videos;
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
        var showData = this.state.showData;
        if (showData == null) {

        }
        return (
            <div id="main-content">
                <div id="basic-info">
                    <ShowHeader show="true" inProduction={showData.in_production} firstRelease={showData.first_air_date} lastRelease={showData.last_air_date} title={showData.name} rating={showData.vote_average} release={showData.first_release_date}/>
                    <div id="movie-details">
                        <p id="details" className="float-left">{(showData.episode_run_time !== 0 && showData.episode_run_time != null) ? showData.episode_run_time[0] : "?"}m&nbsp;&nbsp;|&nbsp;&nbsp;{this.iso[showData.original_language]}</p>
                        <p id="genres" className="float-right">{this.getGenres()}</p>
                    </div>
                    <div className="clearfix"></div>
                    <div id="episodes">
                        <div className="float-left">
                            <p>Episode Guide</p>
                            {showData.number_of_episodes} episodes
                        </div>
                        <div className="float-right"><img id="arrow" src={require("./../../../resources/images/right-arrow.png")} alt="Right arrow"/></div>
                        <div className="clearfix"></div>
                    </div>
                </div>
                <div id="showInfo" className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    {this.getBackdropImage()}
                    <div id="textualInfo">
                        <p id="description">{showData.overview}</p>
                        <hr/>
                          t
                          <hr/>
                          {this.getCastCarousel()}
                        <CommentBox comments={this.state.comments} thread={"t-" + this.state.query}/>
                    </div>
                </div>
                <div id="videos" className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <h1>Featured Videos</h1>
                    <div id="videoList" className="fancy-scrollbar">
                        {this.populateVideos()}
                    </div>
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
}
