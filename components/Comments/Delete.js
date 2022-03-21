import classes from "./Delete.module.scss";

const Delete = (props) => {
    return (
        <button
            className={`${classes.delete} ${props.className ? props.className : ""}`}
            onClick={props.onClick}
            aria-expanded={props.ariaExpanded}
            aria-controls={props.ariaControls}
        >
            <svg
                width="12"
                height="14"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <title>Delete</title>
                <path
                    className={classes.image}
                    d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                    fill="#ED6368"
                />
            </svg>
            <span>Delete</span>
        </button>
    );
};

export default Delete;
