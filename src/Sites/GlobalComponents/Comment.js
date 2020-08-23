import React from "react";

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        var upvoteStatus = this.getUpvotedVal(props.metaData.ratings);
        this.state = {
            metaData: props.metaData,
            depth: props.metaData.depth,
            hidden: false,
            replyContent: "",
            hasUpvoted: upvoteStatus
        }
        this.getUpvoted = this.getUpvoted.bind(this);
        this.getDownvoted = this.getDownvoted.bind(this);
        this.unknown = require("./../../resources/images/unknown-person.png");
    }

    getUpvotedVal(ratings) {
        for (var i = 0; i < ratings.length; i++) {
          var rating = ratings[i];
          if (rating.raterId == global.userId) {
            if (rating.upvote) {
              return "upvote";
            } else {
              return "downvote";
            }
          }
        }
        return "0";
    }

    getProfilePicture() {
        return this.unknown;
    }

    formatTime(amount, unit) {
        if (amount !== 1) {
            return amount + " " + unit + "s ago";
        } else {
            return amount + " " + unit + " ago";
        }
    }

    getHowLongAgo(time) {
        const secondsElapsed = (new Date().getTime() - new Date(time).getTime())/1000;
        if (secondsElapsed < 60) return this.formatTime(Math.round(secondsElapsed), "second");
        if (secondsElapsed < 3600) return this.formatTime(Math.round(secondsElapsed/60), "minute");
        const hoursElapsed = secondsElapsed/3600;
        if (hoursElapsed < 72) return this.formatTime(Math.round(hoursElapsed), "hour");
        return this.formatTime(Math.round(hoursElapsed/24), "day");
    }

    getUpvoted() {
        if (this.state == null) return "upvote";
        if (this.state.hasUpvoted == "upvote") return "upvote upvoted";
        return "upvote";
    }

    getDownvoted() {
        if (this.state == null) return "downvote";
        if (this.state.hasUpvoted == "downvote") return "downvote downvoted";
        return "downvote";
    }

    getStyle() {
        const marginLeft = 30*parseInt(this.state.depth, 10) + "px";
        return {
            marginLeft: marginLeft
        }
    }

    changeReplyContent(event) {
        this.setState(
            {
                replyContent: event.target.value
            }
        )
    }

    getReplyBox() {
        if (this.props.hasReplyField === true) return (
            <div className="reply">
                <textarea onChange={this.changeReplyContent.bind(this)} className="comment-box" placeholder={"Respond to " + this.state.metaData.poster.username} rows="6" name="comment[text]" id="comment_text" cols="40" autoComplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"></textarea>
                <button className="btn btn-primary" onClick={() => this.props.submitPost(this.state.metaData.id, this.state.replyContent)}>Reply ⇒</button>
            </div>
        );
    }

    render() {
        if (this.state.metaData.hidden === true) return "";
        const poster = this.state.metaData.poster, content = this.state.metaData.body;
        if (poster == null || content == null) return "";

        var upvote = this.getUpvoted();
        var downvote = this.getDownvoted();

        if (this.props.primaryMinimize === true) {
            return (
                <div className="comment" style={this.getStyle()}>
                <img className="profile-picture" height="36px" width="auto" src={this.getProfilePicture(content.picture)} alt="Profile"/>
                <div className="comment-c">
                    <div className="float-left">
                        <a href={"/users/" + poster.id}>{poster.username}</a>
                        <p className="text-muted">{this.getHowLongAgo(this.state.metaData.timePosted)}</p>
                    </div>
                    <div className="float-right">
                        <button onClick={() => this.props.maximize(this.state.metaData.id)} className="float-right">+</button>
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
                        <p className="text-muted">{this.getHowLongAgo(this.state.metaData.timePosted)}</p>
                    </div>
                    <div className="float-right">
                        <button onClick={() => this.props.minimize(this.state.metaData.id)} className="float-right">−</button>
                    </div>
                    <div className="clearfix"/>
                </div>
                <div className="clearfix"/>
                <div className="comment-content">
                    <p>{content}</p>
                    <div className="comment-bottomrow">
                        <span><span className="upvote-count">{this.state.metaData.rating}</span>&nbsp;&nbsp;<button className="upvote svg" onClick={() => this.submitRating(true)}><svg className={upvote} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"/></svg></button>&nbsp;|&nbsp;&nbsp;<button className="downvote svg" onClick={() => this.submitRating(false)}><svg className={downvote} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" version="1.1"><path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"/></svg></button></span>
                        <div className="float-right" id="comment-misc">
                            <span onClick={() => this.props.setReplyField(this.state.metaData.id)}>Reply</span>
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            <span>Share</span>
                        </div>
                    </div>
                </div>
                {this.getReplyBox()}
            </div>
        )
    }

    submitRating(upvote) {
      if (global.userId == null) {
        console.log("not signed in");
        return;
      }
      if (this.state.hasUpvoted === "upvote" || this.state.hasUpvoted === "downvote") {
        if (this.state.hasUpvoted === "upvote") {
          this.state.metaData.rating--;
          this.setState({hasUpvoted: "0"});
          if (!upvote) {
            this.state.metaData.rating--;
            this.setState({hasUpvoted: "downvote"});
          }
        } else {
          this.state.metaData.rating++;
          this.setState({hasUpvoted: "0"});
          if (upvote) {
            this.state.metaData.rating++;
            this.setState({hasUpvoted: "upvote"})
          }
        }
      } else {
        if (upvote === "upvote") {
          this.state.metaData.rating++;
          this.setState({hasUpvoted: "upvote"});
          this.state.metaData.rating++;
        } else {
          this.state.metaData.rating--;
          this.setState({hasUpvoted: "downvote"});
        }
      }
      fetch("https://localhost:8080/users/upvote", {
          method: "POST",
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify(
              {
                  postID: this.state.metaData.id,
                  isUpvote: upvote,
              }
          )
      })
    }

}
