import React from "react";

export default class CastCarousel extends React.Component {
    getCast() {
        const castObject = this.props.cast, castArr = [];
        if (castObject == null) return "";
        for (var i = 0; i < castObject.length; i++) {
            var castMember = castObject[i], url;
            if (castMember.picture != null) url = "https://image.tmdb.org/t/p/w92/" + castMember.picture;
            else url = require("./../../resources/images/unknown-person.png");
            castArr.push(
                <a key={castMember.id} href={"/people/" + castMember.id} className="cast-member">
                    <img src={url} className="cast-img" alt="Profile"/>
                    <h2>{castMember.name}</h2>
                    <h4>as</h4>
                    <h2>{castMember.characterName}</h2>
                </a>
            );
        }
        return castArr;
    }

    render() {
        if (this.props.cast == null) return "";
        return (
            <div>
                <div className="cast-carousel">
                    {this.getCast()}
                </div>
            </div>
        );
    }


}
