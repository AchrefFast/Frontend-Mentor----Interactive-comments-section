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
                &#43;
            </button>
            <span className={classes.number}>{props.score}</span>
            <button className={classes.minus} onClick={props.rateDown}>
                &#8722;
            </button>
        </div>
    );
};

export default Rating;
