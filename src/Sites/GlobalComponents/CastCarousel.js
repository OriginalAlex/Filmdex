import React from "react";

export default class CastCarousel extends React.Component {
    getCast() {
        const castObject = this.props.cast, castArr = [];
        if (castObject == null) return "";
        for (var i = 0; i < castObject.length; i++) {
            var castMember = castObject[i];
            castArr.push(
                <a key={castMember.id} href={"/people/" + castMember.id} className="cast-member">
                    <img src={"https://image.tmdb.org/t/p/w92/" + castMember.picture} className="cast-img" alt="Profile"/>
                    <h2>{castMember.name}</h2>
                    <h4>as</h4>
                    <h2>{castMember.characterName}</h2>
                </a>
            );
        }
        return castArr;
    }

    render() {
        return (
            <div className="cast-carousel">
                {this.getCast()}
            </div>
        );
    }


}
