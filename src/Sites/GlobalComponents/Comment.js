import React from "react";

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            metaData: props.metaData,
            depth: props.metaData.depth,
            rating: props.metaData.rating,
            hidden: false,
        }
        this.unknown = require("./../../resources/images/unknown-person.png");
    }

    getProfilePicture() {
        return this.unknown;
    }

    getHowLongAgo(time) {
        const secondsElapsed = (new Date().getTime() - time)/1000;
        if (secondsElapsed < 60) return Math.round(secondsElapsed) + " seconds ago";
        if (secondsElapsed < 3600) return Math.round(secondsElapsed/3600) + " minutes ago";
        const hoursElapsed = secondsElapsed/3600;
        if (hoursElapsed < 72) return Math.round(hoursElapsed) + " hours ago";
        return Math.round(hoursElapsed/24) + " days ago";
    }

    getUpvoted() {
        if (this.state.metaData.upvoted) return "upvote upvoted";
        return "upvote";
    }

    getDownvoted() {
        if (this.state.metaData.downvoted) return "downvote downvoted";
        return "downvote";
    }

    getStyle() {
        const marginLeft = 30*parseInt(this.state.depth, 10) + "px";
        return {
            marginLeft: marginLeft
        }
    }

    getReplyBox() {
        if (this.props.hasReplyField === true) return (
            <div className="reply">
                <textarea className="comment-box" placeholder={"Respond to " + this.state.metaData.poster.username} rows="6" name="comment[text]" id="comment_text" cols="40" autoComplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"></textarea>
                <button className="btn btn-primary">Reply ⇒</button>
            </div>
        );
    }



    render() {
        if (this.state.metaData.hidden === true) return "";
        if (this.state.metaData == null) return;
        const metaData = this.state.metaData, poster = metaData.poster, content = metaData.content;
        if (poster == null || content == null) return;
        if (this.props.primaryMinimize === true) {
            return (
                <div className="comment" style={this.getStyle()}>
                <img className="profile-picture" height="36px" width="auto" src={this.getProfilePicture(content.picture)} alt="Profile"/>
                <div className="comment-c">
                    <div className="float-left">
                        <a href={"/users/" + poster.id}>{poster.username}</a>
                        <p className="text-muted">{this.getHowLongAgo(metaData.time)}</p>
                    </div>
                    <div className="float-right">
                        <button onClick={() => this.props.maximize(metaData.id)} className="float-right">+</button>
                    </div>
                    <div className="clearfix"/>
                </div>
                <div className="clearfix"/>
                </div>
            );
        }
        return (
            <div className="comment" style={this.getStyle()}>
                <img className="profile-picture" height="36px" width="auto" src={this.getProfilePicture(content.picture)} alt="Profile"/>
                <div className="comment-c">
                    <div className="float-left">
                        <a href={"/users/" + poster.id}>{poster.username}</a>
                        <p className="text-muted">{this.getHowLongAgo(metaData.time)}</p>
                    </div>
                    <div className="float-right">
                        <button onClick={() => this.props.minimize(metaData.id)} className="float-right">−</button>
                    </div>
                    <div className="clearfix"/>
                </div>
                <div className="clearfix"/>
                <div className="comment-content">
                    <p>{content}</p>
                    <div className="comment-bottomrow">
                        <span><span className="upvote-count">{this.state.rating}</span>&nbsp;&nbsp;<button className="upvote svg"><svg className={this.getUpvoted()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"/></svg></button>&nbsp;|&nbsp;&nbsp;<button className="downvote svg"><svg className={this.getDownvoted()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" version="1.1"><path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"/></svg></button></span>
                        <div className="float-right" id="comment-misc">
                            <span onClick={() => this.props.setReplyField(metaData.id)}>Reply</span>
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            <span>Share</span>
                        </div>
                    </div>
                </div>
                {this.getReplyBox()}
            </div>
        )
    }
}
