import React from "react";

import Comment from "./Comment";

export default class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: props.comments
        }
    }

    getComments() {
        const comments = this.state.comments, commentsArr = [];
        for (var i = 0; i < comments.length; i++) {
            var individualComment = comments[i];
            commentsArr.push(
                <Comment metaData={individualComment} key={individualComment.poster.username + "-" + individualComment.content}/>
            );
        }
        return commentsArr;
    }

    render() {
        return (
            <div>
            <h1>Comments ({this.props.comments.length})</h1>
                <textarea className="comment-box" placeholder="Share your thoughts..." rows="20" name="comment[text]" id="comment_text" cols="40" autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"></textarea>
                <div id="comments-container">
                    {this.getComments()}
                </div>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            </div>
        );
    }
}
