import React from 'react';

export default class UpcomingFilms extends React.Component {
    addUpcomingFilms() {
        var films = this.props.upcoming, elements = [];
        if (films == null || films.length === 0) return "";
        for (var i = 0; i < films.length; i++) {
            var film = films[i], url = "/movies/" + film.id;
            elements.push(<li key={film.id}><h4><a href={url}>{film.title}</a></h4></li>);
        }
        return elements;
    }

    render() {
        return (
            <div id="upcomingReleases" className="col-lg-12 col-md-12 col-sm-12 col-xs-6">
                <h1 className="header">Upcoming Releases:</h1>
                <ul>
                    {this.addUpcomingFilms()}
                </ul>
            </div>
        );
    }

}
