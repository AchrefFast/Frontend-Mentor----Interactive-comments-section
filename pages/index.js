import Head from "next/head";
import { useState, Fragment, useContext } from "react";
import CommentItem from "../components/Comments/commentItem";
import NewCommentForm from "../components/Form/NewCommentForm";
import AppContext from "../components/store/app-context";
import classes from "../styles/main.module.scss";

export default function Home() {
  const appContext = useContext(AppContext);
  const { currentUser, comments, isLoading, error, addComment } = appContext;

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
      <h1 className={classes.h1}>Comments Section</h1>
      <main>
        {content}
        <NewCommentForm
          type="Send"
          image={{
            png: currentUser.image.png,
            webp: currentUser.image.png,
          }}
          placeholder="Add a comment..."
          onSubmit={addComment}
        />
      </main>
    </Fragment>
  );
}
