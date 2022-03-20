import React, { useState, useEffect } from "react";
import useHttp from "../hooks/useHttp";

const initialState = true;

const AppContext = React.createContext({
    currentUser: {},
    isLoading: false,
    error: false,
    comments: [],
    addComment: (comment) => { },
    deleteComment: (parentId, commentId) => { },
    replyToComment: (parentId, comment) => { },
    editComment: (parentId, commentId, content) => { },
    ratingUp: (parentId, commentId, username) => { },
    ratingDown: (parentId, commentId, username) => { },
});

export const AppContextProvider = (props) => {
    const [currentUser, setCurrentUser] = useState({
        image: { png: null, webp: null },
        username: null,
    });
    const [comments, setComments] = useState([]);
    const { isLoading, error, sendRequest } = useHttp();

    useEffect(() => {
        const localComments = JSON.parse(localStorage.getItem("comments"));
        const localUser = JSON.parse(localStorage.getItem("currentUser"));
        if (localComments && localUser) {
            setComments(localComments);
            setCurrentUser(localUser);
        } else {
            const handleData = (data) => {
                console.log(data.comments);
                setComments(data.comments);
                setCurrentUser(data.currentUser);
                localStorage.setItem("comments", JSON.stringify(data.comments));
                localStorage.setItem("currentUser", JSON.stringify(data.currentUser));
            };
            sendRequest({ url: "/api/app" }, handleData);
        }
    }, [sendRequest]);

    useEffect(() => {
        if (initialState) {
            initialState = false;
            return;
        }
        localStorage.setItem("comments", JSON.stringify(comments));
    }, [comments]);

    const addComment = (comment) => {
        setComments((state) => {
            return [
                ...state,
                {
                    id: state.length + 1,
                    content: comment.content,
                    createdAt: new Date().toString(),
                    score: 0,
                    user: {
                        image: comment.image,
                        username: comment.username,
                    },
                    replies: [],
                },
            ];
        });
    };

    const deleteComment = (parentId, commentId) => {
        let currentComment = [...comments];
        if (parentId === commentId) {
            currentComment = currentComment.filter(
                (comment) => comment.id !== parentId
            );
            setComments(currentComment);
            return;
        }
        let parentComment = currentComment.find(
            (comment) => comment.id === parentId
        );
        parentComment.replies = parentComment.replies.filter(
            (comment) => comment.id !== commentId
        );
        setComments(currentComment);
    };

    const editComment = (parentId, commentId, content) => {
        let currentComments = [...comments];
        if (parentId === commentId) {
            let editedComment = currentComments.find(
                (comment) => comment.id === commentId
            );
            editedComment.content = content;
            setComments(currentComments);
            return;
        }
        let parentComment = currentComments.find(
            (comment) => comment.id === parentId
        );
        let editedComment = parentComment.replies.find(
            (comment) => comment.id === commentId
        );
        editedComment.content = content;
        setComments(currentComments);
    };

    const replyToComment = (replyingToID, comment) => {
        let currentComments = [...comments];
        let parentComment = currentComments.find((comment) => {
            return comment.id === replyingToID;
        });

        parentComment.replies.push({
            id: parentComment.id + "" + (parentComment.replies.length + 1),
            content: comment.content,
            createdAt: new Date().toString(),
            score: 0,
            replyingTo: comment.replyingTo,
            user: {
                image: comment.image,
                username: comment.username,
            },
        });

        setComments(currentComments);
    };

    const ratingUp = (parentId, commentId, username) => {
        console.log("ratingup");
        let currentComments = [...comments];
        let selectedComment;
        if (parentId === commentId) {
            selectedComment = currentComments.find(
                (comment) => comment.id === commentId
            );
        } else {
            let parentComment = currentComments.find(
                (comment) => comment.id === parentId
            );
            selectedComment = parentComment.replies.find(
                (comment) => comment.id === commentId
            );
        }

        if (selectedComment.votersDown) {
            if (selectedComment.votersDown.find((voter) => voter === username)) {
                selectedComment.votersDown = selectedComment.votersDown.filter(
                    (voter) => voter !== username
                );
                selectedComment.score = +selectedComment.score + 1;
                setComments(currentComments);
                return;
            }
        }

        if (selectedComment.votersUp) {
            let hasVoted = selectedComment.votersUp.find(
                (voter) => voter === username
            );
            if (hasVoted === username) {
                return;
            } else {
                selectedComment.votersUp.push(username);
                selectedComment.score = +selectedComment.score + 1;
            }
        } else {
            selectedComment.votersUp = [username];
            selectedComment.score = +selectedComment.score + 1;
        }
        setComments(currentComments);
    };

    const ratingDown = (parentId, commentId, username) => {
        console.log("ratingDown");
        let currentComments = [...comments];
        let selectedComment;
        if (parentId === commentId) {
            selectedComment = currentComments.find(
                (comment) => comment.id === commentId
            );
        } else {
            let parentComment = currentComments.find(
                (comment) => comment.id === parentId
            );
            selectedComment = parentComment.replies.find(
                (comment) => comment.id === commentId
            );
        }
        if (selectedComment.votersUp) {
            if (selectedComment.votersUp.find((voter) => voter === username)) {
                selectedComment.votersUp = selectedComment.votersUp.filter(
                    (voter) => voter !== username
                );
                selectedComment.score = +selectedComment.score - 1;
                setComments(currentComments);
                return;
            }
        }

        if (selectedComment.votersDown) {
            let hasVoted = selectedComment.votersDown.find(
                (voter) => voter === username
            );
            if (hasVoted === username) {
                return;
            } else {
                selectedComment.votersDown.push(username);
                selectedComment.score = +selectedComment.score - 1;
            }
        } else {
            selectedComment.votersDown = [username];
            selectedComment.score = +selectedComment.score - 1;
        }
        setComments(currentComments);
    };

    return (
        <AppContext.Provider
            value={{
                currentUser: currentUser,
                comments,
                isLoading: isLoading,
                error: error,
                addComment: addComment,
                deleteComment: deleteComment,
                replyToComment: replyToComment,
                editComment: editComment,
                ratingUp: ratingUp,
                ratingDown: ratingDown,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContext;
