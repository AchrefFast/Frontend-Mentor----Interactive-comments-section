import classes from "./ToastNotification.module.scss";
import { useState, useEffect, Fragment } from "react";
import { createPortal } from "react-dom";

const ToastNotification = (props) => {

    const className = props.type === 'successful' ? classes.successful : classes.cancel;
    return (
        <Fragment>
            <div
                className={classes.notification + " " + className}
                role="status"
                aria-live="polite"
            >
                <p>{props.message}</p>
                <button onClick={props.onClick} aria-hidden={true}>
                    X
                </button>
            </div>
        </Fragment>
    );
};

const Toast = (props) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        return () => setMounted(false);
    }, []);

    return mounted
        ? createPortal(
            <ToastNotification type={props.type} message={props.message} onClick={props.onClick} />,
            document.querySelector("#toast")
        )
        : null;
};

export default Toast;
