import classes from "./Rating.module.scss";

const Rating = (props) => {
    const votedClass = "";

    if (props.votedUp) {
        votedClass = classes["voted-up"];
    } else if (props.votedDown) {
        votedClass = classes["voted-down"];
    }

    return (
        <div
            className={`${classes.container} ${props.className ? props.className : ""
                } ${votedClass}`}
        >
            <button className={classes.plus} onClick={props.rateUp}>
                &#43; <span className={classes['sr-only']}>upvote comment</span>
            </button>
            <p className={classes.number} role='region' aria-live="polite"><span className={classes['sr-only']}>This comment's rating is </span>{props.score}</p>
            <button className={classes.minus} onClick={props.rateDown}>
                &#8722; <span className={classes['sr-only']}>downvote comment</span>
            </button>
        </div>
    );
};

export default Rating;
