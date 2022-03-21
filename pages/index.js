import Head from "next/head";
import { Fragment, useContext, useState, useEffect } from "react";
import CommentItem from "../components/Comments/CommentItem.js";
import NewCommentForm from "../components/Form/NewCommentForm.js";
import AppContext from "../components/store/app-context.js";
import Toast from "../components/ToastNotification/ToastNotification.js";
import classes from "../styles/main.module.scss";

export default function Home() {
  const appContext = useContext(AppContext);
  const { currentUser, comments, isLoading, error, addComment } = appContext;
  const [notification, setNotification] = useState({});

  useEffect(() => {
    if (!notification.show) {
      return;
    }
    let timerId = setTimeout(() => {
      setNotification({});
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [notification]);

  const addNewCommentHandler = (comment) => {
    addComment(comment);
    setNotification({ show: true, type: 'successful', message: 'Comment added successfully' });
  };
  const hideNotificationHandler = () => {
    setNotification({ show: true, type: 'cancel', message: 'Deleting cancelled' });
  }
  const deleteNotificationHandler = () => {
    setNotification({ show: true, type: 'cancel', message: 'Comment deleted successfully' });
  }

  let content = comments.map((comment) => (
    <CommentItem
      key={comment.id}
      id={comment.id}
      commentId={comment.id}
      userName={comment.user.username}
      image={{
        png: comment.user.image.png,
        webp: comment.user.image.webp,
      }}
      timestamp={comment.createdAt}
      text={comment.content}
      score={comment.score}
      replies={comment.replies || []}
      votedUp={comment.votersUp || []}
      votedDown={comment.votersDown || []}
      onDelete={deleteNotificationHandler}
    />
  ));

  if (isLoading) {
    content = <div className={classes.Loading}>Loading the comments.....</div>;
  }
  if (error) {
    content = <div className={classes.error}>Could not load comments</div>;
  }

  return (
    <Fragment>
      <Head>
        <meta name="description" content="An Interactive comments section" />
        <link rel="icon" href="/favicon.ico" />
        <title>Comments Section</title>
      </Head>
      <header>
        <h1 className={classes.h1}>Comments Section</h1>
      </header>
      <main>
        {content}
        <NewCommentForm
          type="Send"
          image={{
            png: currentUser.image.png,
            webp: currentUser.image.png,
          }}
          placeholder="Add a comment..."
          onSubmit={addNewCommentHandler}
        />
      </main>
      {notification.show && <Toast type={notification.type} message={notification.message} onClick={hideNotificationHandler} />}
    </Fragment>
  );
}
