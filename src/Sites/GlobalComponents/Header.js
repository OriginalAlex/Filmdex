import React from "react";

export default class FilmHeader extends React.Component {

    extrapilateYear(date) {
        if (date == null) return "";
        return date.split("-")[0];
    }

    getReleaseYear() {
        if (this.props.show === "true") {
            if (this.props.inProduction) {
                return this.extrapilateYear(this.props.firstRelease) + "-";
            }
            return this.extrapilateYear(this.props.firstRelease) + "-" + this.extrapilateYear(this.props.lastRelease);
        }
        var fullDate = this.props.release;
        return this.extrapilateYear(fullDate);
    }

    render() {
        return(
            <div id="film-header">
                <h2>{this.props.title}</h2>&nbsp;&nbsp;&nbsp;<span id="release-year" className="text-muted">({this.getReleaseYear()})</span>
                <div className="align-bottom">
                    <h4><span id="rating">{this.props.rating}</span>/10 <button type="button"><span className="glyphicon glyphicon-star"></span></button></h4>
                </div>
            </div>
        );
    }
}
