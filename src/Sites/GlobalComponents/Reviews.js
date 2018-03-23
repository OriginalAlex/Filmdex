import React from "react";

export default class Reviews extends React.Component {
    // 2 size

    getContent() {
        const reviews = this.props.reviews.results, reviewsElement = [];
        if (reviews == null || reviews.length === 0) return "";
        var colLg;
        if (reviews.length === 1) colLg="12";
        else colLg="6";
        for (var i = 0; i < reviews.length && i < 2; i++) {
            var review = reviews[i];
            reviewsElement.push(
                <div key={review.author} className={"col-lg-" + colLg + " col-md-" + colLg + " col-sm-12 col-xs-12"}>
                    <blockquote className="blockquote fancy-scrollbar">
                        <p className="mb-0">{review.content.split("_").join("")}</p>
                        <footer className="blockquote-footer">{review.author}</footer>
                    </blockquote>
                </div>
            );
        }
        return reviewsElement;
    }

    render() {
        return (
            <div id="reviews">
                {this.getContent()}
                <div className="clearfix"/>
            </div>
        );
    }
}
