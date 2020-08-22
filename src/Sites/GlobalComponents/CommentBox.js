import React from "react";

import Comment from "./Comment";

export default class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: props.comments,
            sortedComments: [],
            sortedBy: "new",
            commentWithReply: -1,
            primaryMinimize: [],
            commentText: "",
            thread: props.thread
        }
        this.primaryMinimize = [];
    }

    componentWillMount() {
        const comments = this.props.comments;
        this.commentMap = this.getCommentsWithParent(comments);
        this.addDepth(this.commentMap, -1, 0);
        this.setState(
            {
                sortedComments: this.sort(this.commentMap, -1, this.sortByTime)
            }
        );
        console.log(this.commentMap);
    }

    componentWillReceiveProps(nextProps) { // if it's possible the comments have updated then redo (this is possible because fetch is async)
        const comments = nextProps.comments;
        this.commentMap = this.getCommentsWithParent(comments);
        this.addDepth(this.commentMap, -1, 0);
        this.setState(
            {
                sortedComments: this.sort(this.commentMap, -1, this.sortByTime)
            }
        );
        console.log(this.commentMap);
    }

    // parent is either -1 (i.e. it is at the top) or the ID of the comment that is its parent
    getCommentsWithParent(comments) {
        // comments is an array, by default we will sort in newly posted -> oldest
        var commentMap = new Map();
        for (var i = 0; i < comments.length; i++) {
            var comment = comments[i], parent = comment.replyingTo, arr = commentMap.get(parent);
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
        return this.state.sortedComments;
    }

    addDepth(commentMap, parentId, depth) { // add the "depth" a comment is to each comment (also adds the rating)
        const comments = commentMap.get(parentId);
        if (comments == null) return;
        for (var i = 0; i < comments.length; i++) {
            var comment = comments[i];
            comment.depth = depth;
            var ratings = comment.ratings, upvotes = 0, downvotes = 0;
            for (var j = 0; j < ratings.length; j++) {
                var individualRating = ratings[j];
                console.log(individualRating.isUpvote);
                if (individualRating.isUpvote === true) {
                    upvotes++;
                } else {
                    downvotes++;
                }
            }
            comment.rating = upvotes - downvotes;
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

    maximizeOrMinimize(commentMap, parentId, hiddenValue) { // either maximize or minimize a comment and all its children
        const children = commentMap.get(parentId);
        if (children == null) return;
        for (var i = 0; i < children.length; i++) {
            const child = children[i];
            if (hiddenValue === false) {
                if (!this.state.primaryMinimize.includes(child.id)) {
                    this.maximizeOrMinimize(commentMap, child.id, hiddenValue);
                }
            } else {
                this.maximizeOrMinimize(commentMap, child.id, hiddenValue);
            }
            child.hidden = hiddenValue;
        }
    }

    minimize(id) {
        const commentMap = this.commentMap, primaryMinimize = this.state.primaryMinimize.slice();
        this.maximizeOrMinimize(commentMap, id, true);
        primaryMinimize.push(id);
        this.setState(
            {
                primaryMinimize: primaryMinimize
            }
        );
    }

    maximize(id) {
        const commentMap = this.commentMap, primaryMinimize = this.state.primaryMinimize.slice();
        this.maximizeOrMinimize(commentMap, id, false);
        primaryMinimize.splice(primaryMinimize.indexOf(id), 1);
        this.setState(
            {
                primaryMinimize: primaryMinimize
            }
        );
    }

    getComments() {
        const comments = this.getSortedComments(), commentsArr = [];
        if (comments == null) return;
        for (var i = 0; i < comments.length; i++) {
            var individualComment = comments[i], hasReplyField = false, primaryMinimize = false;
            if (this.state.primaryMinimize.includes(individualComment.id)) primaryMinimize = true;
            if (this.state.commentWithReply === individualComment.id) hasReplyField = true;
            commentsArr.push(
                <Comment
                    metaData={individualComment}
                    key={individualComment.id}
                    hasReplyField={hasReplyField}
                    setReplyField={this.addReplyField.bind(this)}
                    primaryMinimize={primaryMinimize}
                    minimize={this.minimize.bind(this)}
                    maximize={this.maximize.bind(this)}
                    submitPost={this.handleCommentSubmit.bind(this)}
                />
            );
        }
        return commentsArr;
    }

    setSortedBy(sortedBy) {
        this.setState(
            {
                sortedBy: sortedBy
            }
        )
    }

    handleCommentChange(evt) {
        this.setState(
            {
                commentText: evt.target.value
            }
        );
    }

    handleCommentSubmit(parentId, body) {
      console.log(body);
        const commentContent = this.state.commentText;
        fetch("https://localhost:8080/users/submitPost/", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(
                {
                    body: body,
                    thread: this.state.thread,
                    replyingTo: parentId
                }
            )
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
        })
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
                <textarea className="comment-box" onChange={this.handleCommentChange.bind(this)} placeholder="Share your thoughts..." rows="20" name="comment[text]" id="comment_text" cols="40" autoComplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"></textarea>
                <br/>
                <button className="btn btn-primary" onClick={() => this.handleCommentSubmit(-1, this.state.commentText)}>Save ⇒</button>
                <div id="comments-container">
                    {this.getComments()}
                </div>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            </div>
        );
    }
}
