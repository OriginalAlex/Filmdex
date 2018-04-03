import React from 'react';

export default class SearchApp extends React.Component {
    constructor(props) {
        super(props);
        var query = props.match.params.query;
        document.title = query + " - Search";
        this.state = {
            query: query,
            movies: [],
            tvShows: [],
            people: [],
            moviesDisplay: [],
            showsDisplay: [],
            peopleDisplay: []
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
        this.addLinkToHead("./../style/search.css");
        this.addLinkToHead("https://fonts.googleapis.com/css?family=Source+Serif+Pro");
    }


    makeAPICall() {
        const thiz = this;
        fetch("https://localhost:8080/search/" + this.state.query)
        .then(result => result.json())
        .then(data => {
            if (data == null) return;
            var results = data.results, movies = [], tv = [], people = [];
            /*Partition data into subsets of categories*/
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                switch(result.media_type) {
                    case "movie":
                        movies.push(result);
                        break;
                    case "person":
                        people.push(result);
                        break;
                    case "tv":
                        tv.push(result);
                        break;
                    default:
                        console.log(result.media_type);
                        // This would happen if the API adds a new media type
                }
            }
            thiz.setState(
                {
                    movies: movies,
                    tvShows: tv,
                    people: people
                }
            );
            thiz.getMovies(); // this will display the results for each media type
            thiz.getShows();
            thiz.getPeople();
        });
    }

    componentDidMount() {
        this.makeAPICall();
    }

    getImgURL(backdrop) {
        if (backdrop == null) return require("./../../../resources/images/question-mark.png");
        return "https://image.tmdb.org/t/p/w185/" + backdrop;
    }

    mergeWithHR(arr) {
        return (arr
            .reduce((accu, elem) => {
                return accu == null ? [elem] : [accu, <hr key="0"/>, elem]
            }, null));
    }

    getMainBody(containerId, title, displayArr, hasMore, displayMore, onclick) {
        return (<div id={containerId}>
            {displayArr.length !== 0 &&
                <h3 className="category">{title}</h3>
            }
            {this.mergeWithHR(displayArr)}
            {hasMore &&
                <button className="display-btn green" onClick={onclick}>{displayMore}</button>
            }
        </div>);
    }

    getIndividualMovie(movie) {
        const url = "/movies/" + movie.id;
        if (movie.vote_average === 0 || movie.overview == null) return; // don't bother showing them..
        return (
            <a key={movie.id} href={url} className="media">
                <p className="left"><img className="backdrop" src={this.getImgURL(movie.backdrop_path)} width="185" height="104" alt="Backdrop"/></p>
                <h4 className="title">{movie.title} <span className="text-muted">({movie.release_date.split("-")[0]})</span><span className="text-right text-muted">{movie.vote_average}/10</span></h4>
                <p className="overview">{movie.overview}</p>
                <div className="clearfix"/>
            </a>
        )
    }

    getMovies() {
        var arr = this.state.moviesDisplay.slice(), movies = this.state.movies, max, startingLength = arr.length; // max is the number of shows to generate
        if (movies.length === 0) return "";
        if (arr.length === 0) max = 5; // generate 5 movies at the start
        else max = 3; // generate 3 more after more movies are requested
        for (; movies.length !== 0 && arr.length - startingLength < max; movies.shift()) {
            var movieDisplayElement = this.getIndividualMovie(movies[0]);
            if (movieDisplayElement != null) arr.push(movieDisplayElement);
        }
        this.setState({moviesDisplay: arr});
    }

    getIndividualShow(show) {
        const showURL = "/shows/" + show.id;
        if (show.vote_average === 0 || show.overview === "") return;
        return (
            <a href={showURL} className="media" key={show.id}>
                <p className="left"><img className="backdrop" src={this.getImgURL(show.backdrop_path)} height="104px" width="185px" alt="Backdrop"/></p>
                <h4 className="title">{show.name} <span className="text-muted">({show.first_air_date.split("-")[0]})</span><span className="text-right text-muted">{show.vote_average}/10</span></h4>
                <p className="overview">
                    {show.overview}
                </p>
                <div className="clearfix"/>
            </a>
        );
    }

    getShows() {
        var arr = this.state.showsDisplay.slice(), shows = this.state.tvShows, max, startingLength = arr.length;
        if (shows.length === 0) return "";
        if (arr.length === 0) max = 5;
        else max = 3;
        for (; shows.length !== 0 && arr.length - startingLength < max; shows.shift()) {
            var showRepresentation = this.getIndividualShow(shows[0]);
            if (showRepresentation != null) arr.push(showRepresentation);
        }
        this.setState({showsDisplay: arr});
    }

    getPersonURL(profile_path) {
        if (profile_path != null) return this.getImgURL(profile_path);
        return require("./../../../resources/images/unknown-person.png");
    }

    getStarredIn(person) {
        console.log(person.id);
        var elements = [], knownFor = person.known_for;
        for (var i = 0; i < knownFor.length && i < 3; i++) {
            var media = knownFor[i], title;
            if (media.media_type === "movie") title=media.title;
            else title = media.name;
            elements.push(<div key={person.id + "2"}>→ <b>{title}</b></div>);
        }
        return elements;
    }

    getIndividualPerson(person) {
        const personURL = "/people/" + person.id;
        return (
            <a key={person.id} href={personURL} className="media">
                <p className="left"><img className="backdrop" src={this.getPersonURL(person.profile_path)} alt="Face profile" width="100px"/></p>
                <h4 className="title">{person.name}</h4>
                <span className="starredIn">Starred in:</span>
                {this.getStarredIn(person)}
                <div className="clearfix"/>
            </a>
        );
    }

    displayPeople(title, peopleArray, hasMore, displayMore, onclick) {
        return (
            <div id="people-container">
                {peopleArray.length !== 0 &&
                    <h3 className="category">{title}</h3>
                }
                {this.mergeWithHR(peopleArray)}
                {hasMore &&
                    <button className="display-btn green" onClick={onclick}>{displayMore}</button>
                }
            </div>
        );
    }

    getPeople() {
        var arr = this.state.peopleDisplay.slice(), people = this.state.people, max, startingLength = arr.length;
        if (people.length === 0) return "";
        if (arr.length === 0) max = 5;
        else max = 3;
        for (; people.length !== 0 && arr.length - startingLength < max; people.shift()) {
            var personRepresentation = this.getIndividualPerson(people[0]);
            if (personRepresentation != null) arr.push(personRepresentation);
        }
        this.setState({peopleDisplay: arr});
    }

    handleChange(event) {
        this.query = event.target.value;
    }

    search() {
        if (this.query == null || this.query === "") return;
        window.location.href = ("/search/" + this.query);
    }

    keyUp(event) {
        if (event.keyCode === 13) { // if they press the enter key
            this.search();
        }
    }

    render() {
        return (
            <div id="main-content">
                <div id="search-form">
                    <h1 id="search-text">Search</h1>
                    <div id="form-container">
                        <input type="text" onKeyUp={this.keyUp.bind(this)} onChange={this.handleChange.bind(this)} className="textbox" defaultValue={this.state.query} placeholder="Search movies, TV shows, and actors" />
                        <button title="Search" onClick={this.search.bind(this)} className="search-button"><span className="glyphicon glyphicon-search"/></button>
                    </div>
                </div>
                <div id="results-container">
                    <h2 id="display">Displaying results for '{this.state.query}':</h2>
                    {this.getMainBody("movie-container", "Movies:", this.state.moviesDisplay, (this.state.movies.length !== 0), "Display more movies...", this.getMovies.bind(this))}
                    {this.getMainBody("show-container", "TV Shows:", this.state.showsDisplay, (this.state.tvShows.length !== 0), "Display more shows...", this.getShows.bind(this))}
                    {this.displayPeople("People:", this.state.peopleDisplay, (this.state.people.length !== 0), "Display more people...", this.getPeople.bind(this))}
                </div>
            </div>
        );
    }
}
