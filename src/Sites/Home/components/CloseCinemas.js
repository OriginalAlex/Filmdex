import React from 'react';

export default class CloseCinemas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "gotCoords": false
        }
    }

    componentDidMount() {
        const thiz = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const url = "http://www.cinelist.co.uk/search/cinemas/coordinates/" + position.coords.latitude + "/" + position.coords.longitude;
                fetch(url)
                .then(results => results.json())
                .then(data => {
                    thiz.setState({"gotCoords":true,"cinemas":data.cinemas});
                });
            }, function() {
                console.log("failed to get position (cannot show local cinemas)")
            });
        }
    }

    addCloseCinemas() {
        var closeCinemas = this.state.cinemas, elements = [];
        for (var i = 0; i < 5 && i < closeCinemas.length; i++) {
            var cinema = closeCinemas[i], url = "/cinemas/" + cinema.id;
            elements.push(<li key={cinema.id}><h4><a href={url}>{cinema.name}</a></h4></li>);
        }
        return elements;
    }

    render() {
        if (!this.state.gotCoords) return <div className="col-lg-12 col-md-12 col-sm-12 col-xs-6"><h1>Local Cinemas</h1></div>;
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-6">
                <h1 className="header">Local Cinemas:</h1>
                <ul>
                    {this.addCloseCinemas()}
                </ul>
            </div>
        );
    }
}
