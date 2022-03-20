import NewCommentForm from "../Form/NewCommentForm";
import classes from "./CommentItem.module.scss";
import Delete from "./Delete";
import Edit from "./Edit";
import Rating from "./Rating";
import Reply from "./Reply";
import { Fragment, useContext, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import AppContext from "../store/app-context";
import Overlay from "../Backdrop/Backdrop";
import EditForm from "../Form/EditForm";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

function convertComment(text) {
    const regex = /(^@[\w\d]*[.,;-_]? )/gi;
    console.log(text.match(regex));
    const convertedText = text.replace(regex, "");
    return convertedText;
}

//////////////////////////// CommentItem Component ///////////////////////////////////

const CommentItem = (props) => {
    const [replyForm, setReplyForm] = useState(false);
    const [deleteOverlay, setDeleteOverlay] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const {
        currentUser,
        replyToComment,
        deleteComment,
        editComment,
        ratingUp,
        ratingDown,
    } = useContext(AppContext);

    const replyHandler = () => {
        setReplyForm(props.userName);
    };
    const cancelReplyHandler = () => {
        setReplyForm(false);
    };

    const addReplyHandler = (comment) => {
        replyToComment(props.id, {
            content: convertComment(comment.content),
            username: comment.username,
            image: comment.image,
            replyingTo: comment.replyingTo,
        });
    };

    const showDeleteHandler = () => {
        setDeleteOverlay(true);
    };
    const canceleDeleteHandler = () => {
        setDeleteOverlay(false);
    };

    const deleteCommentHandler = () => {
        deleteComment(props.id, props.commentId);
        setDeleteOverlay(true);
    };

    const showEditHandler = () => {
        setShowEdit(true);
    };

    const editCommentHandler = (content) => {
        editComment(props.id, props.commentId, content);
        setShowEdit(false);
    };

    const rateUpHandler = () => {
        ratingUp(props.id, props.commentId, currentUser.username);
    };

    const rateDownHandler = () => {
        ratingDown(props.id, props.commentId, currentUser.username);
    };

    let message = "";

    if (props.replyingTo) {
        message = (
            <Fragment>
                <a href={"#" + props.replyingTo}>@{props.replyingTo + " "}</a>
                {props.text}
            </Fragment>
        );
    }
    else {
        message = props.text;
    }

    let className = classes["comment-block"];

    if (props.subcomment) {
        className = classes["subcomment-block"];
    }

    return (
        <div className={className}>
            {deleteOverlay && (
                <Overlay
                    onCancel={canceleDeleteHandler}
                    onDelete={deleteCommentHandler}
                />
            )}
            <div className={classes.comment}>
                <Rating
                    score={props.score}
                    className={classes.rating}
                    rateUp={rateUpHandler}
                    rateDown={rateDownHandler}
                    votedUp={props.votedUp.find(
                        (voter) => voter === currentUser.username
                    )}
                    votedDown={props.votedDown.find(
                        (voter) => voter === currentUser.username
                    )}
                />
                <div className={classes.body}>
                    <div className={classes.header}>
                        <picture>
                            <source type="image/webp" srcSet={props.image.webp} />
                            <source type="image/png" srcSet={props.image.png} />
                            <img src="/anonymous.png" alt="user Avatar" />
                        </picture>
                        <div className={classes.title}>
                            <div className={classes.username}>{props.userName}</div>
                            {props.userName === currentUser.username && <span>you</span>}
                            <div className={classes.timestamp}>
                                {timeAgo.format(new Date(props.timestamp))}
                            </div>
                        </div>
                    </div>
                    {!showEdit && <div className={classes.content}>{message}</div>}
                    {showEdit && (
                        <EditForm content={props.text} onEdit={editCommentHandler} />
                    )}
                </div>
                {currentUser.username !== props.userName && (
                    <Reply className={classes["reply-button"]} onClick={replyHandler} />
                )}
                {currentUser.username === props.userName && (
                    <div className={classes["reply-button"]}>
                        <Delete onClick={showDeleteHandler} />
                        <Edit onClick={showEditHandler} />
                    </div>
                )}
            </div>
            {replyForm && (
                <NewCommentForm
                    type="reply"
                    image={{
                        png: currentUser.image.png,
                        webp: currentUser.image.webp,
                    }}
                    placeholder="Add a comment..."
                    value={"@" + replyForm + " "}
                    onSubmit={addReplyHandler}
                    onCancel={cancelReplyHandler}
                    replyingTo={props.userName}
                />
            )}
            {(props.replies || []).map((reply) => (
                <CommentItem
                    id={props.id}
                    commentId={reply.id}
                    subcomment={reply.replyingTo}
                    key={reply.id}
                    userName={reply.user.username}
                    image={reply.user.image}
                    timestamp={new Date(reply.createdAt)}
                    text={reply.content}
                    score={reply.score}
                    replyingTo={reply.replyingTo}
                    replies={reply.replies}
                    votedUp={reply.votersUp || []}
                    votedDown={reply.votersDown || []}
                />
            ))}
        </div>
    );
};

export default CommentItem;
