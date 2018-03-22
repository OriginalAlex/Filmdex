import React from 'react';

export default class Film extends React.Component {

    constructor(props) {
        super(props);
        this.state = {"filmMetaData": props.meta, "url": "/movies/" + props.meta.id};
    }

    render() {
        return (
            <a href={this.state.url}>
                <div className="img-wrap">
                    <img src={this.state.filmMetaData.poster} alt={this.state.filmMetaData.title}/>
                    <div className="img-description">
                        <div className="text">
                            <h2>{this.state.filmMetaData.title} <small className="text-muted">({this.state.filmMetaData.scoreOutOfTen}/10)</small></h2>
                            <p className="description">{this.state.filmMetaData.description}</p>
                        </div>
                    </div>
                </div>
            </a>
        );
    }
}
