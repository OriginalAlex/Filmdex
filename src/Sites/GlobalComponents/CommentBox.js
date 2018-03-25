import React from "react";

import Comment from "./Comment";

export default class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: props.comments,
            sortedBy: "new",
            commentWithReply: -1
        }
    }

    // parent is either null (i.e. it is at the top) or the ID of the comment that is its parent
    getCommentsWithParent(comments) {
        // comments is an array, by default we will sort in newly posted -> oldest
        var commentMap = new Map();
        for (var i = 0; i < comments.length; i++) {
            var comment = comments[i], parent = comment.parent, arr = commentMap.get(parent);
            if (arr == null) {
                commentMap.set(parent, [comment]);
            } else {
                arr.push(comment);
            }
        }
        return commentMap;
    }

    sortByTime(arr) {
        arr.sort(function(a,b) {
            return parseInt(b.time, 10) - parseInt(a.time, 10);
        });
    }

    sortByRating(arr) {
        arr.sort(function(a,b) {
            return parseInt(b.rating, 10) - parseInt(a.rating, 10);
        });
    }

    getSortFunction() {
        const sortFunctionName = this.state.sortedBy;
        switch(sortFunctionName) {
            case "top":
                return this.sortByRating;
            case "new":
            default:
                return this.sortByTime;
        }
    }

    // returns an array of the comments sorted in descending order
    sort(map, parent, sortFunction) {
        var comments = map.get(parent), result = [];
        if (comments == null) return;
        this.sortByTime(comments);
        for (var i = 0; i < comments.length; i++) {
            var c = comments[i];
            var cSorted = this.sort(map, c.id, this.getSortFunction()); // get all children sorted with "c" as parent
            result.push(c);
            if (cSorted != null) result = result.concat(cSorted);
        }
        return result;
    }

    getSortedComments() {
        const comments = this.props.comments;
        var commentMap = this.getCommentsWithParent(comments);
        this.addDepth(commentMap, -1, 0);
        return this.sort(commentMap, -1, this.sortByTime);
    }

    addDepth(commentMap, parentId, depth) { // add the "depth" a comment is to each comment (also adds the rating)
        const comments = commentMap.get(parentId);
        if (comments == null) return;
        for (var i = 0; i < comments.length; i++) {
            var comment = comments[i];
            comment.depth = depth;
            comment.rating = parseInt(comment.upvotes, 10) - parseInt(comment.downvotes, 10);
            this.addDepth(commentMap, comment.id, depth+1);
        }
    }

    addReplyField(id) { // set the comment with a certain id to have the reply field (this way it's only one at a time)
        this.setState(
            {
                commentWithReply: id
            }
        );
    }

    getComments() {
        const comments = this.getSortedComments(), commentsArr = [];
        for (var i = 0; i < comments.length; i++) {
            var individualComment = comments[i], hasReplyField = false;
            if (this.state.commentWithReply === individualComment.id) hasReplyField = true;
            commentsArr.push(
                <Comment
                    metaData={individualComment}
                    key={individualComment.id}
                    hasReplyField={hasReplyField}
                    setReplyField={this.addReplyField.bind(this)}
                    />
            );
        }
        return commentsArr;
    }

    setSortedBy(sortedBy) {
        console.log(this.state);
        this.setState(
            {
                sortedBy: sortedBy
            }
        )
    }

    render() {
        return (
            <div>
                <div id="float-container">
                    <div className="left">
                        <h1>Comments ({this.props.comments.length})</h1>
                    </div>
                    <div className="right">
                        <div id="comment-dropdown" className="dropdown">
                            <div id="sort-container">
                                <div id="sort">
                                    <span className="center">Sorted by&nbsp;&nbsp;</span>
                                    <button id="sort-button" className="btn btn-default" type="button" data-toggle="dropdown">{this.state.sortedBy}&nbsp;&nbsp;<span className="caret"/></button>
                                    <ul className="dropdown-menu">
                                        <li onClick={(e) => this.setSortedBy("new")}>{"new"}</li>
                                        <li onClick={(e) => this.setSortedBy("top")}>top</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="clearfix"/>
                <textarea className="comment-box" placeholder="Share your thoughts..." rows="20" name="comment[text]" id="comment_text" cols="40" autoComplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"></textarea>
                <br/>
                <button className="btn btn-primary">Save ⇒</button>
                <div id="comments-container">
                    {this.getComments()}
                </div>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            </div>
        );
    }
}
