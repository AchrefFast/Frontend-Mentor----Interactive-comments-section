import classes from "./Backdrop.module.scss";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

const Backdrop = (props) => {
    return (
        <div className={classes.container} onClick={props.onCancel}>
            <div className={classes.box}>
                <h2>Delete Comment</h2>
                <p>
                    {`Are you sure you want to delete this comment? This will remove the
                    comment and can't be undone.`}
                </p>
                <div className={classes.buttons}>
                    <button className={classes.cancel} onClick={props.onCancel}>
                        {`No, Cancel`}
                    </button>
                    <button className={classes.delete} onClick={props.onDelete}>
                        {`Yes, Delete`}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Overlay = (props) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        return () => setMounted(false);
    }, []);

    return mounted
        ? createPortal(
            <Backdrop onCancel={props.onCancel} onDelete={props.onDelete} />,
            document.querySelector("#myportal")
        )
        : null;
};

export default Overlay;
