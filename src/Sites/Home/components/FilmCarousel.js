import React from 'react';
import FilmCarouselItem from './FilmCarouselItem';

export default class FilmCarousel extends React.Component {
    renderFilms() {
        var films = [], filmsInfo = this.props.films;
        if (filmsInfo.length === 0) return "";
        films.push(<div key={filmsInfo[0].id}><FilmCarouselItem meta={filmsInfo[0]}/></div>);
        for (var i = 1; i < filmsInfo.length; i++) {
            films.push(<div key={filmsInfo[i].id}><FilmCarouselItem meta={filmsInfo[i]}/></div>);
        }
        return films;
    }

    render() {
        return(
            <div id="film-carousel">
                {this.renderFilms()}
            </div>
        );
    }
}
