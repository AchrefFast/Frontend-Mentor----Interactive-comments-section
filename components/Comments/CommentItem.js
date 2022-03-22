import NewCommentForm from "../Form/NewCommentForm";
import classes from "./CommentItem.module.scss";
import Delete from "./Delete";
import Edit from "./Edit";
import Rating from "./Rating";
import Reply from "./Reply";
import { Fragment, useContext, useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import AppContext from "../store/app-context";
import Overlay from "../Backdrop/Backdrop";
import EditForm from "../Form/EditForm";
import Toast from "../ToastNotification/ToastNotification";

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
    const [replyIsInvalid, setInvalidReply] = useState(false);
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
        setInvalidReply(false);
        props.notification({
            show: true,
            type: "cancel",
            message: "Replying cancelled",
        });
    };

    const addReplyHandler = (comment) => {
        if (convertComment(comment.content).trim() === "") {
            setInvalidReply(true);
            return;
        }

        replyToComment(props.id, {
            content: convertComment(comment.content),
            username: comment.username,
            image: comment.image,
            replyingTo: comment.replyingTo,
        });
        setInvalidReply(false);
        setReplyForm(false);
        props.notification({
            show: true,
            type: "successful",
            message: "Comment addded successfully",
        });
    };

    const showDeleteHandler = () => {
        setDeleteOverlay(true);
    };
    const canceleDeleteHandler = () => {
        setDeleteOverlay(false);
        console.log('running');
        props.notification({
            show: true,
            type: "cancel",
            message: "Deleting cancelled",
        });
    };

    const deleteCommentHandler = () => {
        deleteComment(props.id, props.commentId);
        setDeleteOverlay(false);
        props.notification({
            show: true,
            type: "successful",
            message: "Comment deleted successfully",
        });
    };

    const showEditHandler = () => {
        setShowEdit(true);
    };

    const editCommentHandler = (content) => {
        editComment(props.id, props.commentId, content);
        setShowEdit(false);
        props.notification({
            show: true,
            type: "successful",
            message: "Comment updated successfully",
        });
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
    } else {
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
                <div className={classes.body}>
                    <div className={classes.header}>
                        <a href={`#${props.userName}`}>
                            <picture>
                                <source type="image/webp" srcSet={props.image.webp} />
                                <source type="image/png" srcSet={props.image.png} />
                                <img src="/anonymous.png" alt={`${props.userName}`} />
                            </picture>
                        </a>
                        <div className={classes.title}>
                            <a className={classes.username} href={`#${props.userName}`}>
                                {props.userName}
                            </a>
                            {props.userName === currentUser.username && <span>you</span>}
                            <p className={classes.timestamp}>
                                {timeAgo.format(new Date(props.timestamp))}
                            </p>
                        </div>
                    </div>
                    {!showEdit && <p className={classes.content}>{message}</p>}
                    {showEdit && (
                        <EditForm
                            content={props.text}
                            onEdit={editCommentHandler}
                            id={`edit-${props.id}`}
                        />
                    )}
                </div>
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
                {currentUser.username !== props.userName && (
                    <Reply
                        className={classes["reply-button"]}
                        onClick={replyHandler}
                        ariaExpanded={replyForm ? true : false}
                        ariaControls={`reply-${props.id}`}
                    />
                )}
                {currentUser.username === props.userName && (
                    <div className={classes["reply-button"]}>
                        <Delete
                            onClick={showDeleteHandler}
                            ariaExpanded={deleteOverlay}
                            ariaControls={"delete-overlay"}
                        />
                        <Edit
                            onClick={showEditHandler}
                            ariaExpanded={showEdit}
                            ariaControls={`edit-${props.id}`}
                        />
                    </div>
                )}
            </div>
            {replyForm && (
                <NewCommentForm
                    id={`reply-${props.id}`}
                    type="reply"
                    image={{
                        png: currentUser.image.png,
                        webp: currentUser.image.webp,
                    }}
                    placeholder="Add a comment..."
                    value={"@" + replyForm + " "}
                    onSubmit={addReplyHandler}
                    onCancel={cancelReplyHandler}
                    isInvalid={replyIsInvalid}
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
                    notification={props.notification}
                />
            ))}


        </div>
    );
};

export default CommentItem;
